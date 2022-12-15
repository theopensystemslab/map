import { stylefunction } from "ol-mapbox-style";
import { MVT } from "ol/format";
import { Tile as TileLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import { OSM, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import VectorTileSource from "ol/source/VectorTile";
import { getServiceURL } from "../../lib/ordnanceSurvey";

const OS_COPYRIGHT = `© Crown copyright and database rights ${new Date().getFullYear()} OS (0)100024857`;

export function makeRasterBaseMap(apiKey: string, proxyEndpoint: string) {
  const tileServiceURL = getServiceURL({
    service: "xyz",
    apiKey,
    proxyEndpoint,
  });
  return new TileLayer({
    properties: {
      name: "rasterBaseMap",
    },
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
      attributions: [OS_COPYRIGHT],
      attributionsCollapsible: false,
    }),
  });

  const vectorTileStyleUrl = getServiceURL({
    service: "vectorTileStyle",
    apiKey,
    proxyEndpoint,
    params: { srs: "3857" },
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
