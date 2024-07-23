import { MultiPoint, MultiPolygon, Polygon } from "ol/geom";
import { Type } from "ol/geom/Geometry";
import { Draw, Modify, Snap } from "ol/interaction";
import { createBox } from "ol/interaction/Draw";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle, Fill, RegularShape, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { StyleLike } from "ol/style/Style";
import { pointsSource } from "./snapping";

export type DrawTypeEnum = Extract<Type, "Polygon" | "Point">;
export type DrawShapeEnum = "freehand" | "box" | "circle";
export type DrawPointerEnum = "crosshair" | "dot";

// drawPointer styles
function crosshair(drawColor: string) {
  return new RegularShape({
    stroke: new Stroke({
      color: drawColor,
      width: 2,
    }),
    points: 4, // crosshair aka star
    radius: 15, // outer radius
    radius2: 1, // inner radius
  });
}

function dot(drawColor: string) {
  return new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: drawColor,
    }),
  });
}

function polygonVertices(drawColor: string) {
  return new Style({
    image: new RegularShape({
      fill: new Fill({
        color: "#fff",
      }),
      stroke: new Stroke({
        color: drawColor,
        width: 2,
      }),
      points: 4, // squares
      radius: 5,
      angle: Math.PI / 4,
    }),
    geometry: function (feature) {
      const geom = feature.getGeometry();
      // display the coordinates of the polygon(s)
      if (geom instanceof Polygon) {
        const coordinates = geom.getCoordinates()[0];
        return new MultiPoint(coordinates);
      } else if (geom instanceof MultiPolygon) {
        const coordinates = geom.getCoordinates().flat(2);
        return new MultiPoint(coordinates);
      } else {
        return;
      }
    },
  });
}

function boundaryLayerStyle(
  drawColor: string,
  drawColorFill: string,
): StyleLike {
  return [
    new Style({
      fill: new Fill({
        color: drawColorFill,
      }),
      stroke: new Stroke({
        color: drawColor,
        width: 3,
      }),
    }),
    polygonVertices(drawColor),
  ];
}

function configureBoundaryDrawStyle(
  pointerStyle: DrawPointerEnum,
  drawColor: string,
  drawFillColor: string,
) {
  return new Style({
    stroke: configureDashedStroke(drawColor),
    fill: new Fill({
      color: drawFillColor,
    }),
    image: pointerStyle === "crosshair" ? crosshair(drawColor) : dot(drawColor),
  });
}

function configureDashedStroke(drawColor: string) {
  return new Stroke({
    color: drawColor,
    width: 3,
    lineDash: [2, 8],
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
  pointColor: string,
  drawColor: string,
  drawFillColor: string,
) {
  return new VectorLayer({
    source: drawingSource,
    style:
      drawType === "Polygon"
        ? boundaryLayerStyle(drawColor, drawFillColor)
        : configurePointLayerStyle(pointColor),
  });
}

// configure the key openlayers interactions
export function configureDraw(
  drawType: DrawTypeEnum,
  drawShape: DrawShapeEnum,
  pointerStyle: DrawPointerEnum,
  pointColor: string,
  drawColor: string,
  drawFillColor: string,
) {
  return new Draw({
    source: drawingSource,
    type: configureDrawType(drawType, drawShape),
    style:
      drawType === "Polygon"
        ? configureBoundaryDrawStyle(pointerStyle, drawColor, drawFillColor)
        : configurePointDrawStyle(pointColor),
    geometryFunction: configureGeometryFunction(drawShape),
  });
}

export function configureDrawType(
  drawType: DrawTypeEnum,
  drawShape: DrawShapeEnum,
): Type {
  if (["box", "circle"].includes(drawShape)) {
    return "Circle";
  } else {
    return drawType;
  }
}

function configureGeometryFunction(drawShape: DrawShapeEnum) {
  if (drawShape === "box") {
    return createBox();
  } else {
    return undefined;
  }
}

export const snap = new Snap({
  source: pointsSource, // empty if OS VectorTile basemap is disabled & zoom > 20
  pixelTolerance: 15,
});

export function configureModify(
  drawShape: DrawShapeEnum,
  pointerStyle: DrawPointerEnum,
  drawColor: string,
) {
  return new Modify({
    source: drawingSource,
    style: new Style({
      image:
        pointerStyle === "crosshair" ? crosshair(drawColor) : dot(drawColor),
    }),
    insertVertexCondition: configureInsertVertexCondition(drawShape),
  });
}

function configureInsertVertexCondition(drawShape: DrawShapeEnum) {
  // @todo research better "box" modification !
  //   this simply skips new vertices and only allows existing ones to be modified, but doesn't preserve box-stretch drawing interaction
  //   ref https://github.com/openlayers/openlayers/issues/5095
  //       https://openlayers.org/en/latest/examples/draw-and-modify-features.html
  return function () {
    return drawShape !== "box";
  };
}
