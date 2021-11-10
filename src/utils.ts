import { asArray, asString } from "ol/color";
import { buffer } from "ol/extent";
import Geometry from "ol/geom/Geometry";
import Map from "ol/Map";
import { Vector } from "ol/source";
import { getArea } from "ol/sphere";

export type AreaUnitEnum = "m2" | "ha";

/**
 * Calculate & format the area of a polygon
 * @param polygon
 * @param unit - defaults to square metres ("m2"), or supports "ha" for hectares
 * @returns - the total area formatted with unit as a string
 */
export function formatArea(polygon: Geometry, unit: AreaUnitEnum) {
  const area = getArea(polygon);

  const squareMetres = Math.round(area * 100) / 100;
  const hectares = squareMetres / 10000; // 0.0001 hectares in 1 square metre

  let output;
  if (unit === "m2") {
    output = squareMetres + " m²";
  } else if (unit === "ha") {
    output = hectares + " ha";
  }

  return output;
}

/**
 * Fit map view to extent of data features, overriding default zoom & center
 * @param olMap - an OpenLayers map
 * @param olSource - an OpenLayers vector source
 * @param bufferValue - amount to buffer extent by, refer to https://openlayers.org/en/latest/apidoc/module-ol_extent.html#.buffer
 * @returns - a map view
 */
export function fitToData(
  olMap: Map,
  olSource: Vector<Geometry>,
  bufferValue: number
) {
  const extent = olSource.getExtent();
  return olMap.getView().fit(buffer(extent, bufferValue));
}

/**
 * Translate a hex color to an rgba string with opacity
 * @param hexColor - a hex color string
 * @param alpha - a decimal to represent opacity
 * @returns - a 'rgba(r,g,b,a)' string
 */
export function hexToRgba(hexColor: string, alpha: number) {
  const [r, g, b] = Array.from(asArray(hexColor));
  return asString([r, g, b, alpha]);
}
