import { MultiPoint, Polygon } from "ol/geom";
import { Draw, Modify, Snap } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Fill, RegularShape, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { pointsSource } from "./snapping";

export type DrawPointerEnum = "crosshair" | "dot";

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

const crosshair = new RegularShape({
  stroke: new Stroke({
    color: "red",
    width: 2,
  }),
  points: 4, // crosshair aka star
  radius1: 15, // outer radius
  radius2: 1, // inner radius
});

const dot = new CircleStyle({
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
    const geom = feature.getGeometry();
    if (geom instanceof Polygon) {
      // return the coordinates of the drawn polygon
      const coordinates: number[][] = geom.getCoordinates()[0];
      return new MultiPoint(coordinates);
    } else {
      return;
    }
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

export function configureDraw(pointerStyle: DrawPointerEnum) {
  return new Draw({
    source: drawingSource,
    type: "Polygon",
    style: new Style({
      stroke: redDashedStroke,
      fill: redLineFill,
      image: pointerStyle === "crosshair" ? crosshair : dot,
    }),
  });
}

export const snap = new Snap({
  source: pointsSource, // empty if OS VectorTile basemap is disabled & zoom > 20
  pixelTolerance: 15,
});

export function configureModify(pointerStyle: DrawPointerEnum) {
  return new Modify({
    source: drawingSource,
    style: new Style({
      image: pointerStyle === "crosshair" ? crosshair : dot,
    }),
  });
}
