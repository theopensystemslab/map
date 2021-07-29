import stylefunction from "ol-mapbox-style/dist/stylefunction";
import { MVT } from "ol/format";
import { Tile as TileLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import { OSM, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import VectorTileSource from "ol/source/VectorTile";

// Ordnance Survey sources
const tileServiceUrl = `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${
  import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY
}`;
const vectorTileServiceUrl = `https://api.os.uk/maps/vector/v1/vts/tile/{z}/{y}/{x}.pbf?srs=3857&key=${
  import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY
}`;
const vectorTileStyleUrl = `https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${
  import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY
}`;

export const rasterBaseMap = new TileLayer({
  source: import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY
    ? new XYZ({
        url: tileServiceUrl,
        attributions: [
          "© Crown copyright and database rights 2021 OS (0)100019252",
        ],
        attributionsCollapsible: false,
        maxZoom: 20,
      })
    : // No OrdnanceSurvey key found, sign up for free here https://osdatahub.os.uk/plans
      new OSM({
        attributions: [ATTRIBUTION],
      }),
});

export const osVectorTileBaseMap = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    format: new MVT(),
    url: vectorTileServiceUrl,
    attributions: [
      "© Crown copyright and database rights 2021 OS (0)100019252",
    ],
    attributionsCollapsible: false,
  }),
});

// ref https://github.com/openlayers/ol-mapbox-style#usage-example
async function applyStyle() {
  try {
    const response = await fetch(vectorTileStyleUrl);
    const glStyle = await response.json();
    stylefunction(osVectorTileBaseMap, glStyle, "esri");
  } catch (error) {
    console.log(error);
  }
}

applyStyle();
