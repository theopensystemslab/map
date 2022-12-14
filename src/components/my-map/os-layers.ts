import { stylefunction } from "ol-mapbox-style";
import { MVT } from "ol/format";
import { Tile as TileLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import { OSM, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import VectorTileSource from "ol/source/VectorTile";

const OS_DOMAIN = "https://api.os.uk";
type OSServices = "xyz" | "vectorTile" | "vectorTileStyle";

const OS_COPYRIGHT = `© Crown copyright and database rights ${new Date().getFullYear()} OS (0)100024857`;

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
  // OL requires that {z}/{x}/{y} are not encoded in order to substitue in real values
  const openLayersURL = decodeURI(url.href);
  return openLayersURL;
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

// OS API key must be appended to requests by the proxy endpoint
// Please see docs: TODO!
export function getProxyServiceURL(
  service: OSServices,
  proxyEndpoint: string
): string {
  let { origin: proxyOrigin, pathname: proxyPathname } = new URL(proxyEndpoint);
  // Remove trailing slash on pathname if present
  proxyPathname = proxyPathname.replace(/\/$/, "");

  const serviceURLLookup = {
    xyz: constructURL(proxyOrigin, proxyPathname + tileServicePath),
    vectorTile: constructURL(
      proxyOrigin,
      proxyPathname + vectorTileServicePath,
      { srs: "3857" }
    ),
    vectorTileStyle: constructURL(
      proxyOrigin,
      proxyPathname + vectorTileStylePath,
      { srs: "3857" }
    ),
  };
  return serviceURLLookup[service];
}

// Assumption: If you provide an API key this takes precedent over a proxy?
export function getServiceURL({
  service,
  apiKey,
  proxyEndpoint,
}: {
  service: OSServices;
  apiKey?: string;
  proxyEndpoint?: string;
}): string | undefined {
  if (apiKey) return getOSServiceURL(service, apiKey);
  if (proxyEndpoint) return getProxyServiceURL(service, proxyEndpoint);
  return;
}

export function makeRasterBaseMap(apiKey: string, proxyEndpoint: string) {
  const tileServiceURL = getServiceURL({
    service: "xyz",
    apiKey,
    proxyEndpoint,
  });
  return new TileLayer({
    source: tileServiceURL
      ? new XYZ({
          url: tileServiceURL,
          attributions: [OS_COPYRIGHT],
          attributionsCollapsible: false,
          maxZoom: 20,
        })
      : // no OS API key found, sign up here https://osdatahub.os.uk/plans
        new OSM({
          attributions: [ATTRIBUTION],
        }),
  });
}

export function makeOsVectorTileBaseMap(apiKey: string, proxyEndpoint: string) {
  const vectorTileServiceUrl = getServiceURL({
    service: "vectorTile",
    apiKey,
    proxyEndpoint,
  });
  const osVectorTileLayer = new VectorTileLayer({
    declutter: true,
    source: new VectorTileSource({
      format: new MVT(),
      url: vectorTileServiceUrl,
      attributions: [OS_COPYRIGHT],
      attributionsCollapsible: false,
    }),
  });

  const vectorTileStyleUrl = getServiceURL({
    service: "vectorTileStyle",
    apiKey,
    proxyEndpoint,
  });
  if (vectorTileStyleUrl) {
    // ref https://github.com/openlayers/ol-mapbox-style#usage-example
    fetch(vectorTileStyleUrl)
      .then((response) => response.json())
      .then((glStyle) => stylefunction(osVectorTileLayer, glStyle, "esri"))
      .catch((error) => console.log(error));
  }

  return osVectorTileLayer;
}
