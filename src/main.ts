import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import OLMap from "ol/Map";
import "ol/ol.css";
import { fromLonLat, transformExtent } from "ol/proj";
import { Vector as VectorSource, XYZ } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import View from "ol/View";

const baseMap = new TileLayer({
  source: new XYZ({
    url: `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${process.env.REACT_APP_ORDNANCE_SURVEY_KEY}`,
  }),
});

const source = new VectorSource();

const vector = new VectorLayer({
  source: source,
  style: new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    stroke: new Stroke({
      color: "#ff0000",
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: "#ffcc33",
      }),
    }),
  }),
});

const map = new OLMap({
  layers: [baseMap, vector],
  target: "map",
  view: new View({
    projection: "EPSG:3857",
    extent: transformExtent(
      [-10.76418, 49.528423, 1.9134116, 61.331151],
      "EPSG:4326",
      "EPSG:3857"
    ),
    minZoom: 7,
    maxZoom: 20,
    center: fromLonLat([-0.126, 51.502]),
    zoom: 19,
  }),
});

const modify = new Modify({ source: source });
map.addInteraction(modify);

function addInteractions() {
  const draw = new Draw({
    source: source,
    type: "Polygon",
  });
  map.addInteraction(draw);
  const snap = new Snap({ source: source, pixelTolerance: 5 });
  map.addInteraction(snap);
}

addInteractions();
