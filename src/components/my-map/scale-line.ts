import "ol/ol.css";
import { ScaleLine } from "ol/control";

export function scaleControl(useScaleBarStyle: boolean) {
  return new ScaleLine({
    units: "metric",
    bar: useScaleBarStyle,
    steps: 4,
    text: true,
    minWidth: 140,
  });
}
