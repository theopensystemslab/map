import { stylefunction } from "ol-mapbox-style";
import { MVT } from "ol/format";
import { Tile as TileLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import { OSM, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import VectorTileSource from "ol/source/VectorTile";

const OS_DOMAIN = "https://api.os.uk";
type OSServices = "xyz" | "vectorTile" | "vectorTileStyle";

// Ordnance Survey sources
const tileServicePath = `/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png`;
const vectorTileServicePath = `/maps/vector/v1/vts/tile/{z}/{y}/{x}.pbf`;
const vectorTileStylePath = `/maps/vector/v1/vts/resources/styles`;

export function constructURL(
  domain: string,
  path: string,
  params: Record<string, string> = {}
): string {
  const url = new URL(path, domain);
  url.search = new URLSearchParams(params).toString();
  return url.href;
}

export function getOSServiceURL(service: OSServices, apiKey: string): string {
  const serviceURLLookup = {
    xyz: constructURL(OS_DOMAIN, tileServicePath, { key: apiKey }),
    vectorTile: constructURL(OS_DOMAIN, vectorTileServicePath, {
      key: apiKey,
      srs: "3857",
    }),
    vectorTileStyle: constructURL(OS_DOMAIN, vectorTileStylePath, {
      key: apiKey,
      srs: "3857",
    }),
  };
  return serviceURLLookup[service];
}

export function makeRasterBaseMap(copyright: string, apiKey: string) {
  const tileServiceURL = getOSServiceURL("xyz", apiKey);
  // TODO: fix conditional API key
  return new TileLayer({
    source: apiKey
      ? new XYZ({
          url: tileServiceURL,
          attributions: [copyright],
          attributionsCollapsible: false,
          maxZoom: 20,
        })
      : // no OS API key found, sign up here https://osdatahub.os.uk/plans
        new OSM({
          attributions: [ATTRIBUTION],
        }),
  });
}

export function makeOsVectorTileBaseMap(
  copyright: string,
  apiKey: string,
  osProxyEndpoint?: string
) {
  const vectorTileServiceUrl = getOSServiceURL("vectorTile", apiKey);
  const osVectorTileLayer = new VectorTileLayer({
    declutter: true,
    source: new VectorTileSource({
      format: new MVT(),
      url: vectorTileServiceUrl,
      attributions: [copyright],
      attributionsCollapsible: false,
    }),
  });

  if (apiKey) {
    const vectorTileStyleUrl = getOSServiceURL("vectorTileStyle", apiKey);
    // ref https://github.com/openlayers/ol-mapbox-style#usage-example
    fetch(vectorTileStyleUrl)
      .then((response) => response.json())
      .then((glStyle) => stylefunction(osVectorTileLayer, glStyle, "esri"))
      .catch((error) => console.log(error));
  }

  return osVectorTileLayer;
}
