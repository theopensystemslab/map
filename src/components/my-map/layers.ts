import { stylefunction } from "ol-mapbox-style";
import { MVT } from "ol/format";
import { Tile as TileLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import { OSM, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import VectorTileSource from "ol/source/VectorTile";
import { getServiceURL } from "../../lib/ordnanceSurvey";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export type BasemapEnum =
  | "OSM"
  | "MapboxSatellite"
  | "OSRaster"
  | "OSVectorTile";

export function makeDefaultTileLayer(): TileLayer<OSM> {
  const layer = new TileLayer({
    source: new OSM({
      attributions: [ATTRIBUTION],
      crossOrigin: "anonymous",
    }),
  });
  layer.set("name", "osmBasemap");
  return layer;
}

export function makeMapboxSatelliteBasemap(): VectorLayer<VectorSource> {
  // Layer is empty besides attribution, style is "applied" after instantiating map in index.ts
  const layer = new VectorLayer({
    source: new VectorSource({
      attributions:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a> <a href="https://labs.mapbox.com/contribute/#/-74@site/src/10" target="_blank" rel="noopener noreferrer"><strong>Improve this map</strong></a>',
    }),
  });
  layer.set("name", "mapboxSatelliteBasemap"); // @todo debug why not actually set??
  return layer;
}

export function makeOSRasterBasemap(
  apiKey: string,
  proxyEndpoint: string,
  copyright: string,
): TileLayer<XYZ> {
  const tileServiceURL = getServiceURL({
    service: "xyz",
    apiKey,
    proxyEndpoint,
  });
  const layer = new TileLayer({
    source: new XYZ({
      url: tileServiceURL,
      attributions: [copyright],
      crossOrigin: "anonymous",
      maxZoom: 20,
    }),
  });
  layer.set("name", "osRasterBasemap");
  return layer;
}

export function makeOsVectorTileBasemap(
  apiKey: string,
  proxyEndpoint: string,
  copyright: string,
): VectorTileLayer {
  const vectorTileServiceUrl = getServiceURL({
    service: "vectorTile",
    apiKey,
    proxyEndpoint,
    params: { srs: "3857" },
  });
  const osVectorTileLayer = new VectorTileLayer({
    declutter: true,
    source: new VectorTileSource({
      format: new MVT(),
      url: vectorTileServiceUrl,
      attributions: [copyright],
    }),
  });

  const vectorTileStyleUrl = getServiceURL({
    service: "vectorTileStyle",
    apiKey,
    proxyEndpoint,
    params: { srs: "3857" },
  });
  // ref https://github.com/openlayers/ol-mapbox-style#usage-example
  fetch(vectorTileStyleUrl)
    .then((response) => response.json())
    .then((glStyle) => stylefunction(osVectorTileLayer, glStyle, "esri"))
    .catch((error) => console.log(error));

  osVectorTileLayer.set("name", "osVectorTileBasemap");
  return osVectorTileLayer;
}
