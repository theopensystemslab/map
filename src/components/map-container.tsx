import { h } from "preact";
import register from "preact-custom-element";

import StaticMap from "./static-map";

// Web Component that will wrap & return our map component
const MapContainer = ({ geojson = [] }) => (
  <StaticMap geojson={geojson} />
);

register(MapContainer, "map-container", ['geojson']);
