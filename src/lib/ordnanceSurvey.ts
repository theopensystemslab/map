const OS_DOMAIN = "https://api.os.uk";
type OSServices =
  | "xyz"
  | "vectorTile"
  | "vectorTileStyle"
  | "places"
  | "features";
type ServiceLookup = Record<OSServices, string>;
interface ServiceOptions {
  service: OSServices;
  apiKey: string;
  proxyEndpoint: string;
  params?: Record<string, string>;
}

// Ordnance Survey sources
const tileServicePath = "/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png";
const vectorTileServicePath = "/maps/vector/v1/vts/tile/{z}/{y}/{x}.pbf";
const vectorTileStylePath = "/maps/vector/v1/vts/resources/styles";
const placesPath = "/search/places/v1/postcode";
const featuresPath = "/features/v1/wfs";

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

export function getOSServiceURL({
  service,
  apiKey,
  params,
}: Omit<ServiceOptions, "proxyEndpoint">): string {
  const serviceURLLookup: ServiceLookup = {
    xyz: constructURL(OS_DOMAIN, tileServicePath, { ...params, key: apiKey }),
    vectorTile: constructURL(OS_DOMAIN, vectorTileServicePath, {
      ...params,
      key: apiKey,
    }),
    vectorTileStyle: constructURL(OS_DOMAIN, vectorTileStylePath, {
      ...params,
      key: apiKey,
    }),
    places: constructURL(OS_DOMAIN, placesPath, { ...params, key: apiKey }),
    features: constructURL(OS_DOMAIN, featuresPath, { ...params, key: apiKey }),
  };
  return serviceURLLookup[service];
}

// OS API key must be appended to requests by the proxy endpoint
// Please see docs: TODO!
export function getProxyServiceURL({
  service,
  proxyEndpoint,
  params,
}: Omit<ServiceOptions, "apiKey">): string {
  let { origin: proxyOrigin, pathname: proxyPathname } = new URL(proxyEndpoint);
  // Remove trailing slash on pathname if present
  proxyPathname = proxyPathname.replace(/\/$/, "");

  const serviceURLLookup: ServiceLookup = {
    xyz: constructURL(proxyOrigin, proxyPathname + tileServicePath, params),
    vectorTile: constructURL(
      proxyOrigin,
      proxyPathname + vectorTileServicePath,
      params
    ),
    vectorTileStyle: constructURL(
      proxyOrigin,
      proxyPathname + vectorTileStylePath,
      params
    ),
    places: constructURL(proxyOrigin, proxyPathname + placesPath, params),
    features: constructURL(proxyOrigin, proxyPathname + featuresPath, params),
  };
  return serviceURLLookup[service];
}

/**
 * Get either an OS service URL, or a proxied endpoint to an OS service URL
 */
export function getServiceURL({
  service,
  apiKey,
  proxyEndpoint,
  params,
}: ServiceOptions): string {
  if (proxyEndpoint)
    return getProxyServiceURL({ service, proxyEndpoint, params });
  if (apiKey) return getOSServiceURL({ service, apiKey, params });
  throw Error(
    `Unable to generate URL for OS ${service} API. Either an API key or proxy endpoint must be supplied`
  );
}
