import { GeoJSON } from "ol/format";
import { Vector as VectorLayer } from "ol/layer";
import { toLonLat } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import { Stroke, Style } from "ol/style";

const featureServiceUrl = "https://api.os.uk/features/v1/wfs";

export const featureSource = new VectorSource();

export const featureLayer = new VectorLayer({
  source: featureSource,
  style: new Style({
    stroke: new Stroke({
      width: 3,
      color: "#0000ff",
    }),
  }),
});

/**
 * Create an OGC XML filter parameter value which will select the TopographicArea
 *   features containing the coordinates of the provided point
 * @param coord - xy coordinate
 */
export function getFeatures(coord: Array<number>) {
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
    key: import.meta.env.VITE_APP_OS_WFS_KEY,
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
      console.log("features:", data);

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

      featureSource.clear();
      featureSource.addFeatures(features);
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
