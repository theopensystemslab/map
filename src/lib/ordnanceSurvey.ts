const OS_DOMAIN = "https://api.os.uk";
type OSServices = "xyz" | "vectorTile" | "vectorTileStyle";
type ServiceLookup = Record<OSServices, string>;

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
  const serviceURLLookup: ServiceLookup = {
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

  const serviceURLLookup: ServiceLookup = {
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

export function getServiceURL({
  service,
  apiKey,
  proxyEndpoint,
}: {
  service: OSServices;
  apiKey?: string;
  proxyEndpoint?: string;
}): string | undefined {
  if (proxyEndpoint) return getProxyServiceURL(service, proxyEndpoint);
  if (apiKey) return getOSServiceURL(service, apiKey);
  return;
}
