import { MultiPoint, Polygon } from "ol/geom";
import { Draw, Modify, Snap } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle, Fill, RegularShape, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { StyleLike } from "ol/style/Style";
import { pointsSource } from "./snapping";

export type DrawTypeEnum = "Polygon" | "Point"; // ref https://openlayers.org/en/latest/apidoc/module-ol_geom_Geometry.html#~Type
export type DrawPointerEnum = "crosshair" | "dot";

// drawPointer styles
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

// feature style: red-line site boundary
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

const polygonVertices = new Style({
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

const boundaryLayerStyle: StyleLike = [
  new Style({
    fill: redLineFill,
    stroke: redLineStroke,
  }),
  polygonVertices,
];

function configureBoundaryDrawStyle(pointerStyle: DrawPointerEnum) {
  return new Style({
    stroke: redDashedStroke,
    fill: redLineFill,
    image: pointerStyle === "crosshair" ? crosshair : dot,
  });
}

// feature style: single point
function configurePointLayerStyle(pointColor: string) {
  return new Style({
    image: new Circle({
      radius: 9,
      fill: new Fill({ color: pointColor }),
    }),
  });
}

function configurePointDrawStyle(pointColor: string) {
  return new Style({
    fill: new Fill({ color: pointColor }),
  });
}

export const drawingSource = new VectorSource();

export function configureDrawingLayer(
  drawType: DrawTypeEnum,
  pointColor: string
) {
  return new VectorLayer({
    source: drawingSource,
    style:
      drawType === "Polygon"
        ? boundaryLayerStyle
        : configurePointLayerStyle(pointColor),
  });
}

// configure the key openlayers interactions
export function configureDraw(
  drawType: DrawTypeEnum,
  pointerStyle: DrawPointerEnum,
  pointColor: string
) {
  return new Draw({
    source: drawingSource,
    type: drawType,
    style:
      drawType === "Polygon"
        ? configureBoundaryDrawStyle(pointerStyle)
        : configurePointDrawStyle(pointColor),
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
