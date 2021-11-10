import MultiPoint from "ol/geom/MultiPoint";
import { Draw, Modify, Snap } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import {
  Circle as CircleStyle,
  Fill,
  RegularShape,
  Stroke,
  Style,
} from "ol/style";
import { pointsSource } from "./snapping";

const redLineBase = {
  color: "#ff0000",
  width: 3,
};

const redLineStroke = new Stroke(redLineBase);

const redDashedStroke = new Stroke({
  ...redLineBase,
  lineDash: [2, 8],
});

const redLineFill = new Fill({
  color: "rgba(255, 0, 0, 0.1)",
});

const drawingPointer = new CircleStyle({
  radius: 6,
  fill: new Fill({
    color: "#ff0000",
  }),
});

const drawingVertices = new Style({
  image: new RegularShape({
    fill: new Fill({
      color: "#fff",
    }),
    stroke: new Stroke({
      color: "#ff0000",
      width: 2,
    }),
    points: 4, // squares
    radius: 5,
    angle: Math.PI / 4,
  }),
  geometry: function (feature) {
    // return the coordinates of the drawn polygon
    const coordinates = feature.getGeometry().getCoordinates()[0];
    return new MultiPoint(coordinates);
  },
});

export const drawingSource = new VectorSource();

export const drawingLayer = new VectorLayer({
  source: drawingSource,
  style: [
    new Style({
      fill: redLineFill,
      stroke: redLineStroke,
    }),
    drawingVertices,
  ],
});

export const draw = new Draw({
  source: drawingSource,
  type: "Polygon",
  style: new Style({
    stroke: redDashedStroke,
    fill: redLineFill,
    image: drawingPointer,
  }),
});

export const snap = new Snap({
  source: pointsSource, // empty if OS VectorTile basemap is disabled & zoom > 20
  pixelTolerance: 15,
});

export const modify = new Modify({
  source: drawingSource,
  style: new Style({
    image: drawingPointer,
  }),
});
