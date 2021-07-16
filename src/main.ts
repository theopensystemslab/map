import union from "@turf/union";
import { Control, defaults as defaultControls } from "ol/control";
import { GeoJSON, MVT } from "ol/format";
import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import VectorTileLayer from 'ol/layer/VectorTile';
import OLMap from "ol/Map";
import "ol/ol.css";
import { fromLonLat, toLonLat, transformExtent } from "ol/proj";
import { OSM, Vector as VectorSource, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import VectorTileSource from 'ol/source/VectorTile';
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import View from "ol/View";

// Ordance Survey sources
const tileServiceUrl = "https://api.os.uk/maps/raster/v1/zxy";
const featureServiceUrl = "https://api.os.uk/features/v1/wfs";

// Custom control for draw mode interactions
class DrawModeControl extends Control {
  constructor(control_options) {
    const options = control_options || {};

    const button = document.createElement("button");
    button.innerText = "🖍";

    const element = document.createElement("div");
    element.className = "draw-mode ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", this.startDrawing.bind(this), false);
  }

  startDrawing() {
    const modify = new Modify({ source: drawingSource });
    map.addInteraction(modify);

    function addInteractions() {
      const draw = new Draw({
        source: drawingSource,
        type: "Polygon",
      });
      map.addInteraction(draw);
      const snap = new Snap({ source: drawingSource, pixelTolerance: 5 });
      map.addInteraction(snap);
    }

    addInteractions();
  }

  exitDrawing() {
    // TODO
  }
}

const baseMapLayer = new TileLayer({
  source: process.env.REACT_APP_ORDNANCE_SURVEY_KEY
    ? new XYZ({
        url: `${tileServiceUrl}/Light_3857/{z}/{x}/{y}.png?key=${process.env.REACT_APP_ORDNANCE_SURVEY_KEY}`,
        attributions: [
          "© Crown copyright and database rights 2021 OS (0)100019252",
        ],
        attributionsCollapsible: false,
        maxZoom: 20,
      })
    : // No OrdnanceSurvey key found, sign up for free here https://osdatahub.os.uk/plans
      new OSM({
        attributions: [ATTRIBUTION],
      }),
});

const osVectorTileLayer = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    format: new MVT(),
    url: `https://api.os.uk/maps/vector/v1/vts/tile/{z}/{y}/{x}.pbf?srs=3857&key=${process.env.REACT_APP_ORDNANCE_SURVEY_KEY}`,
    attributions:[
      "© Crown copyright and database rights 2021 OS (0)100019252",
    ],
    attributionsCollapsible: false,
  }),
});

const osVectorTileStyleUrl = `https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${process.env.REACT_APP_ORDNANCE_SURVEY_KEY}`;
// TODO figure out how to apply this??

const drawingSource = new VectorSource();

const redLineStroke = new Stroke({
  color: "#ff0000",
  width: 3,
});

const drawingLayer = new VectorLayer({
  source: drawingSource,
  style: new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    stroke: redLineStroke,
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: "#ffcc33",
      }),
    }),
  }),
});

const featureSource = new VectorSource();

const outlineSource = new VectorSource();
const outlineLayer = new VectorLayer({
  source: outlineSource,
  style: new Style({
    stroke: redLineStroke,
  }),
});

const map = new OLMap({
  controls: defaultControls().extend([new DrawModeControl({})]),
  layers: [osVectorTileLayer, drawingLayer, outlineLayer],
  target: "map",
  view: new View({
    projection: "EPSG:3857",
    extent: transformExtent(
      [-10.76418, 49.528423, 1.9134116, 61.331151],
      "EPSG:4326",
      "EPSG:3857"
    ),
    minZoom: 7,
    maxZoom: 22,
    center: fromLonLat([-0.126, 51.502]),
    zoom: 19,
  }),
});

// Select features on singleclick
// TODO only allow if WFS key is found & disable during draw mode
map.on("singleclick", function (e) {
  getFeatures(e.coordinate);
});

function getFeatures(coord) {
  // Create an OGC XML filter parameter value which will select the TopographicArea
  // features containing the coordinates of the clicked point
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
    key: process.env.REACT_APP_OS_WFS_KEY,
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
      console.log("clicked feature:", data);

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

      outlineSource.clear(true);
      outlineSource.addFeature(
        // merge all of the features into a single feature
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
 * @param {object} params - The parameters object to be encoded
 */
function getUrl(params) {
  const encodedParameters = Object.keys(params)
    .map((paramName) => paramName + "=" + encodeURI(params[paramName]))
    .join("&");

  return `${featureServiceUrl}?${encodedParameters}`;
}
