import React from "react";
import { render } from "react-dom";
import Component from "./Map";

const viewport = {
  latitude: 51,
  longitude: 0,
  zoom: 10,
  bearing: 0,
  pitch: 0,
};

render(
  <Component
    LAYER_ORDNANCE_SURVEY="ordnance-survey"
    layer="ordnance-survey"
    {...viewport}
  />,
  document.getElementById("root")
);
