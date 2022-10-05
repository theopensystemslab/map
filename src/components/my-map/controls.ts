import "ol/ol.css";
import { Control, ScaleLine } from "ol/control";
import northArrowIcon from "./icons/north-arrow-n.svg";

export function scaleControl(useScaleBarStyle: boolean) {
  return new ScaleLine({
    units: "metric",
    bar: useScaleBarStyle,
    steps: 4,
    text: false,
    minWidth: 140,
  });
}

export function northArrowControl() {
  const image = document.createElement("img");
  image.src = northArrowIcon;
  image.title = "North";

  const element = document.createElement("div");
  element.className = "north-arrow-control ol-unselectable ol-control";
  element.appendChild(image);

  return new Control({ element: element });
}
