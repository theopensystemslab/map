import Geometry from "ol/geom/Geometry";
import { getArea } from "ol/sphere";

export type AreaUnitEnum =  "m2" | "ha";

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
