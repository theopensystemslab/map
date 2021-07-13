import React from "react";
import { render } from "react-dom";
import Component from "./Map";

render(
  <Component LAYER_ORDNANCE_SURVEY="ordnance-survey" layer="ordnance-survey" />,
  document.getElementById("root")
);
