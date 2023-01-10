import { Control, ScaleLine } from "ol/control";
import "ol/ol.css";
import northArrowIcon from "./icons/north-arrow-n.svg";
import trashCanIcon from "./icons/trash-can.svg";

export function scaleControl(useScaleBarStyle: boolean) {
  return new ScaleLine({
    units: "metric",
    bar: useScaleBarStyle,
    steps: 4,
    text: useScaleBarStyle,
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

export function resetControl(listener: any, icon: string) {
  const button = document.createElement("button");
  button.title = "Reset map view";

  if (icon === "unicode") {
    button.innerHTML = "↻";
  } else {
    const image = document.createElement("img");
    image.className = "reset-icon";
    image.src = trashCanIcon;
    button.appendChild(image);
  }

  // this is an internal event listener, so doesn't need to be removed later
  // ref https://lit.dev/docs/components/lifecycle/#disconnectedcallback
  button.addEventListener("click", listener, false);

  const element = document.createElement("div");
  element.className = "reset-control ol-unselectable ol-control";
  element.appendChild(button);

  return new Control({ element: element });
}
