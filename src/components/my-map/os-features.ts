import union from "@turf/union";
import { GeoJSON } from "ol/format";
import { Vector as VectorLayer } from "ol/layer";
import { toLonLat } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import { Fill, Stroke, Style } from "ol/style";

import { hexToRgba } from "./utils";

const featureServiceUrl = "https://api.os.uk/features/v1/wfs";

const featureSource = new VectorSource();

export const outlineSource = new VectorSource();

export function makeFeatureLayer(
  color: string,
  featureFill: boolean,
  borderNone: boolean
) {
  return new VectorLayer({
    source: outlineSource,
    style: new Style({
      stroke: borderNone
        ? undefined
        : new Stroke({
            width: 3,
            color: color,
          }),
      fill: new Fill({
        color: featureFill ? hexToRgba(color, 0.2) : hexToRgba(color, 0),
      }),
    }),
  });
}

/**
 * Create an OGC XML filter parameter value which will select the TopographicArea
 *   features containing the coordinates of the provided point
 * @param coord - xy coordinate
 * @param apiKey - Ordnance Survey Features API key, sign up here: https://osdatahub.os.uk/plans
 * @param supportClickFeatures - whether the featureSource should support `clickFeatures` mode or be cleared upfront
 */
export function getFeaturesAtPoint(
  coord: Array<number>,
  apiKey: any,
  supportClickFeatures: boolean
) {
  const xml = `
    <ogc:Filter>
      <ogc:Contains>
      <ogc:PropertyName>SHAPE</ogc:PropertyName>
        <gml:Point srsName="urn:ogc:def:crs:EPSG::4326">
          <gml:coordinates>${toLonLat(coord)
            .reverse()
            .join(",")}</gml:coordinates>
        </gml:Point>
      </ogc:Contains>
    </ogc:Filter>
  `;

  // Define (WFS) parameters object
  const wfsParams = {
    key: apiKey,
    service: "WFS",
    request: "GetFeature",
    version: "2.0.0",
    typeNames: "Topography_TopographicArea",
    propertyName: "TOID,DescriptiveGroup,SHAPE",
    outputFormat: "GEOJSON",
    srsName: "urn:ogc:def:crs:EPSG::4326",
    filter: xml,
    count: 1,
  };

  // Use fetch() method to request GeoJSON data from the OS Features API
  // If successful, replace everything in the vector layer with the GeoJSON response
  fetch(getUrl(wfsParams))
    .then((response) => response.json())
    .then((data) => {
      if (!data.features.length) return;

      const properties = data.features[0].properties,
        validKeys = ["TOID", "DescriptiveGroup"];

      Object.keys(properties).forEach(
        (key) => validKeys.includes(key) || delete properties[key]
      );

      const geojson = new GeoJSON();

      const features = geojson.readFeatures(data, {
        featureProjection: "EPSG:3857",
      });

      if (supportClickFeatures) {
        // Allows for many features to be selected/deselected when `showFeaturesAtPoint` && `clickFeatures` are enabled
        features.forEach((feature) => {
          const id = feature.getProperties().TOID;
          const existingFeature = featureSource.getFeatureById(id);

          if (existingFeature) {
            featureSource.removeFeature(existingFeature);
          } else {
            feature.setId(id);
            featureSource.addFeature(feature);
          }
        });
      } else {
        // Clears the source upfront to prevent previously fetched results from persisting when only `showFeaturesAtPoint` is enabled
        featureSource.clear();
        features.forEach((feature) => {
          const id = feature.getProperties().TOID;
          feature.setId(id);
          featureSource.addFeature(feature);
        });
      }

      outlineSource.clear();
      outlineSource.addFeature(
        // Merge all of the features into a single feature
        geojson.readFeature(
          featureSource.getFeatures().reduce((acc: any, curr) => {
            const toMerge = geojson.writeFeatureObject(curr).geometry;
            return acc ? union(acc, toMerge) : toMerge;
          }, null)
        )
      );
    })
    .catch((error) => console.log(error));
}

/**
 * Helper function to return OS Features URL with encoded parameters
 * @param {object} params - parameters object to be encoded
 * @returns {string}
 */
function getUrl(params: any) {
  const encodedParameters = Object.keys(params)
    .map((paramName) => paramName + "=" + encodeURI(params[paramName]))
    .join("&");

  return `${featureServiceUrl}?${encodedParameters}`;
}
