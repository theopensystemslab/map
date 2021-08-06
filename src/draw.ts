import Geometry from "ol/geom/Geometry";
import { Draw, Modify, Snap } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { getArea } from "ol/sphere";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

const redLineStroke = new Stroke({
  color: "#ff0000",
  width: 3,
});

const drawingPointer = new CircleStyle({
  radius: 6,
  fill: new Fill({
    color: "#ff0000",
  }),
});

export const drawingSource = new VectorSource();

export const drawingLayer = new VectorLayer({
  source: drawingSource,
  style: new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.4)",
    }),
    stroke: redLineStroke,
  }),
});

export const draw = new Draw({
  source: drawingSource,
  type: "Polygon",
  style: new Style({
    stroke: new Stroke({
      color: "#ff0000",
      width: 3,
      lineDash: [2, 8],
    }),
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    image: drawingPointer,
  }),
});

export const snap = new Snap({
  source: drawingSource,
  pixelTolerance: 5,
});

export const modify = new Modify({
  source: drawingSource,
  style: new Style({
    image: drawingPointer,
  }),
});

// calculate and format the area of a polygon
export function formatArea(polygon: Geometry) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
}
