import { FeatureLike } from "ol/Feature";
import { MultiPoint, MultiPolygon, Polygon } from "ol/geom";
import { Type } from "ol/geom/Geometry";
import { Draw, Modify, Snap } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle, Fill, RegularShape, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { pointsSource } from "./snapping";
import { hexToRgba } from "./utils";

export type DrawTypeEnum = Extract<Type, "Polygon" | "Point" | "Circle">;
export type DrawPointerEnum = "crosshair" | "dot";

function configureDrawPointerImage(
  drawPointer: DrawPointerEnum,
  drawColor: string,
) {
  switch (drawPointer) {
    case "crosshair":
      return new RegularShape({
        stroke: new Stroke({
          color: drawColor,
          width: 2,
        }),
        points: 4, // crosshair aka star
        radius: 15, // outer radius
        radius2: 1, // inner radius
      });
    case "dot":
      return new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: drawColor,
        }),
      });
  }
}

function getVertices(drawColor: string) {
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

function styleFeatureLabels(drawType: DrawTypeEnum, feature: FeatureLike) {
  return new Text({
    text: feature.get("label"),
    font: "80px inherit",
    placement: drawType === "Point" ? "line" : "point", // "point" placement is center point of polygon
    fill: new Fill({
      color: "#000",
    }),
    stroke: new Stroke({
      color: "#fff",
      width: 3,
    }),
  });
}

function configureDrawingLayerStyle(
  drawType: DrawTypeEnum,
  drawColor: string,
  drawMany: boolean,
  feature: FeatureLike,
) {
  switch (drawType) {
    case "Point":
      return new Style({
        image: new Circle({
          radius: 9,
          fill: new Fill({ color: drawColor }),
        }),
        text: drawMany ? styleFeatureLabels(drawType, feature) : undefined,
      });
    default:
      return [
        new Style({
          fill: new Fill({
            color: hexToRgba(drawColor, 0.2),
          }),
          stroke: new Stroke({
            color: drawColor,
            width: 3,
          }),
          text: drawMany ? styleFeatureLabels(drawType, feature) : undefined,
        }),
        getVertices(drawColor),
      ];
  }
}

export const drawingSource = new VectorSource({ wrapX: false });

export function configureDrawingLayer(
  drawType: DrawTypeEnum,
  drawColor: string,
  drawMany: boolean,
) {
  return new VectorLayer({
    source: drawingSource,
    style: function (feature) {
      return configureDrawingLayerStyle(drawType, drawColor, drawMany, feature);
    },
  });
}

function configureDrawInteractionStyle(
  drawType: DrawTypeEnum,
  drawPointer: DrawPointerEnum,
  drawColor: string,
) {
  switch (drawType) {
    case "Point":
      return new Style({
        fill: new Fill({ color: drawColor }),
      });
    default:
      return new Style({
        stroke: new Stroke({
          color: drawColor,
          width: 3,
          lineDash: [2, 8],
        }),
        fill: new Fill({
          color: hexToRgba(drawColor, 0.2),
        }),
        image: configureDrawPointerImage(drawPointer, drawColor),
      });
  }
}

export function configureDraw(
  drawType: DrawTypeEnum,
  drawPointer: DrawPointerEnum,
  drawColor: string,
) {
  return new Draw({
    source: drawingSource,
    type: drawType,
    style: configureDrawInteractionStyle(drawType, drawPointer, drawColor),
  });
}

export const snap = new Snap({
  source: pointsSource, // empty if OS VectorTile basemap is disabled & zoom > 20
  pixelTolerance: 15,
});

export function configureModify(
  drawPointer: DrawPointerEnum,
  drawColor: string,
) {
  return new Modify({
    source: drawingSource,
    style: new Style({
      image: configureDrawPointerImage(drawPointer, drawColor),
    }),
  });
}
