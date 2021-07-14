import { Control, defaults as defaultControls } from 'ol/control';
import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import OLMap from "ol/Map";
import "ol/ol.css";
import { fromLonLat, transformExtent } from "ol/proj";
import { OSM, Vector as VectorSource, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import View from "ol/View";

class DrawModeControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
   constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerText = '🖍';

    const element = document.createElement('div');
    element.className = 'draw-mode ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.startDrawing.bind(this), false);
  }

  startDrawing() {
    const modify = new Modify({ source: drawingSource });
    map.addInteraction(modify);
    
    function addInteractions() {
      const draw = new Draw({
        source: drawingSource,
        type: "Polygon",
      });
      map.addInteraction(draw);
      const snap = new Snap({ source: drawingSource, pixelTolerance: 5 });
      map.addInteraction(snap);
    }
    
    addInteractions();
  }

  exitDrawing() {
    // TBD
  }
}

const baseMapLayer = new TileLayer({
  source: process.env.REACT_APP_ORDNANCE_SURVEY_KEY
    ? new XYZ({
        url: `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${process.env.REACT_APP_ORDNANCE_SURVEY_KEY}`,
        attributions: [
          "© Crown copyright and database rights 2021 OS (0)100019252",
        ],
        attributionsCollapsible: false,
      })
    : // No OrdnanceSurvey key found, sign up for free here https://osdatahub.os.uk/plans
      new OSM({
        attributions: [
          ATTRIBUTION
        ],
      }),
});

const drawingSource = new VectorSource();

const drawingLayer = new VectorLayer({
  source: drawingSource,
  style: new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    stroke: new Stroke({
      color: "#ff0000",
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: "#ffcc33",
      }),
    }),
  }),
});

const map = new OLMap({
  controls: defaultControls().extend([new DrawModeControl({})]),
  layers: [baseMapLayer, drawingLayer],
  target: "map",
  view: new View({
    projection: "EPSG:3857",
    extent: transformExtent(
      [-10.76418, 49.528423, 1.9134116, 61.331151],
      "EPSG:4326",
      "EPSG:3857"
    ),
    minZoom: 7,
    maxZoom: 20,
    center: fromLonLat([-0.126, 51.502]),
    zoom: 19,
  }),
});
