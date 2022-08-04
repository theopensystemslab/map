import { get as getProjection, Projection } from "ol/proj";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

export type ProjectionEnum = "EPSG:4326" | "EPSG:27700";

// https://openlayers.org/en/latest/examples/reprojection.html
proj4.defs(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 " +
    "+x_0=400000 +y_0=-100000 +ellps=airy " +
    "+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 " +
    "+units=m +no_defs"
);
register(proj4);

export const proj27700: Projection = getProjection("EPSG:27700");
