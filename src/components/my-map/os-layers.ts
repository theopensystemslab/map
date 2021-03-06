import { stylefunction } from "ol-mapbox-style";
import { MVT } from "ol/format";
import { Tile as TileLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import { OSM, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import VectorTileSource from "ol/source/VectorTile";

// Ordnance Survey sources
const tileServiceUrl = `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=`;
const vectorTileServiceUrl = `https://api.os.uk/maps/vector/v1/vts/tile/{z}/{y}/{x}.pbf?srs=3857&key=`;
const vectorTileStyleUrl = `https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=`;

export function makeRasterBaseMap(copyright: string, apiKey?: string) {
  return new TileLayer({
    source: apiKey
      ? new XYZ({
          url: tileServiceUrl + apiKey,
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

export function makeOsVectorTileBaseMap(copyright: string, apiKey: string) {
  let osVectorTileLayer = new VectorTileLayer({
    declutter: true,
    source: new VectorTileSource({
      format: new MVT(),
      url: vectorTileServiceUrl + apiKey,
      attributions: [copyright],
      attributionsCollapsible: false,
    }),
  });

  if (apiKey) {
    // ref https://github.com/openlayers/ol-mapbox-style#usage-example
    fetch(vectorTileStyleUrl + apiKey)
      .then((response) => response.json())
      .then((glStyle) => stylefunction(osVectorTileLayer, glStyle, "esri"))
      .catch((error) => console.log(error));
  }

  return osVectorTileLayer;
}
