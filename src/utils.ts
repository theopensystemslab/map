import { buffer } from "ol/extent";
import Geometry from "ol/geom/Geometry";
import Map from "ol/Map";
import { Vector } from "ol/source";
import { getArea } from "ol/sphere";

/**
 * Calculate & format the area of a polygon
 * @param polygon
 * @param units - defaults to square metres ("m2"), or supports "ha" for hectares
 * @returns - a string
 */
export function formatArea(polygon: Geometry, units: String = "m2") {
  const area = getArea(polygon);

  const squareMetres = Math.round(area * 100) / 100;
  const hectares = squareMetres / 10000; // 0.0001 hectares in 1 square metre

  let output;
  if (units === "m2") {
    output = squareMetres + " m²";
  } else if (units === "ha") {
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
