import { stylefunction } from "ol-mapbox-style";
import { MVT } from "ol/format";
import { Tile as TileLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import { OSM, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import VectorTileSource from "ol/source/VectorTile";
import { getServiceURL } from "../../lib/ordnanceSurvey";

export function makeRasterBaseMap(
  apiKey: string,
  proxyEndpoint: string,
  copyright: string,
  collapseAttributions: boolean,
): TileLayer<OSM> {
  const isUsingOS = Boolean(apiKey || proxyEndpoint);
  // Fallback to OSM if not using OS services
  const basemap = isUsingOS
    ? makeOSRasterBaseMap(
        apiKey,
        proxyEndpoint,
        copyright,
        collapseAttributions,
      )
    : makeDefaultTileLayer();
  basemap.set("name", "rasterBaseMap");
  return basemap;
}

function makeOSRasterBaseMap(
  apiKey: string,
  proxyEndpoint: string,
  copyright: string,
  collapseAttributions: boolean,
): TileLayer<XYZ> {
  const tileServiceURL = getServiceURL({
    service: "xyz",
    apiKey,
    proxyEndpoint,
  });
  return new TileLayer({
    source: new XYZ({
      url: tileServiceURL,
      attributions: [copyright],
      crossOrigin: "anonymous",
      attributionsCollapsible: collapseAttributions,
      maxZoom: 20,
    }),
  });
}

function makeDefaultTileLayer(): TileLayer<OSM> {
  return new TileLayer({
    source: new OSM({
      attributions: [ATTRIBUTION],
      crossOrigin: "anonymous",
    }),
  });
}

export function makeOsVectorTileBaseMap(
  apiKey: string,
  proxyEndpoint: string,
  copyright: string,
  collapseAttributions: boolean,
): VectorTileLayer | undefined {
  const isUsingOS = Boolean(apiKey || proxyEndpoint);
  if (!isUsingOS) return;

  const vectorTileServiceUrl = getServiceURL({
    service: "vectorTile",
    apiKey,
    proxyEndpoint,
    params: { srs: "3857" },
  });
  const osVectorTileLayer = new VectorTileLayer({
    declutter: true,
    properties: {
      name: "vectorBaseMap",
    },
    source: new VectorTileSource({
      format: new MVT(),
      url: vectorTileServiceUrl,
      attributions: [copyright],
      attributionsCollapsible: collapseAttributions,
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

  return osVectorTileLayer;
}
