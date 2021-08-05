import { css, customElement, html, LitElement, property } from "lit-element";
import { Control } from "ol/control";
import { buffer } from 'ol/extent';
import { GeoJSON } from "ol/format";
import { Vector as VectorLayer } from "ol/layer";
import Map from "ol/Map";
import { fromLonLat, transformExtent } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import { Stroke, Style } from "ol/style";
import View from "ol/View";
import { last } from "rambda";

import { draw, drawingLayer, drawingSource, formatArea, modify, snap } from "./draw";
import { osVectorTileBaseMap, rasterBaseMap } from "./os-layers";

@customElement("my-map")
export class MyMap extends LitElement {
  // default map size, can be overridden with CSS
  static styles = css`
    :host {
      display: block;
      width: 800px;
      height: 800px;
      position: relative;
    }
    #map {
      height: 100%;
      opacity: 0;
      transition: opacity 0.25s;
      overflow: hidden;
    }
    .reset-control {
      top: 70px;
      left: .5em;
    }
    #area {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 100;
      background: white;
    }
  `;

  // configurable component properties
  @property({ type: Number })
  latitude = 51.507351;

  @property({ type: Number })
  longitude = -0.127758;

  @property({ type: Number })
  zoom = 10;

  @property({ type: Number })
  minZoom = 7;

  @property({ type: Number })
  maxZoom = 22;

  @property({ type: Boolean })
  drawMode = true;

  @property({ type: Object })
  geojsonData = {
    type: "FeatureCollection",
    features: [],
  };

  private useVectorTiles =
    Boolean(import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY) &&
    osVectorTileBaseMap;

  // runs after the initial render
  firstUpdated() {
    const target = this.shadowRoot?.querySelector("#map") as HTMLElement;

    const map = new Map({
      target,
      layers: [this.useVectorTiles ? osVectorTileBaseMap : rasterBaseMap],
      view: new View({
        projection: "EPSG:3857",
        extent: transformExtent(
          // UK Boundary
          [-10.76418, 49.528423, 1.9134116, 61.331151],
          "EPSG:4326",
          "EPSG:3857"
        ),
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        center: fromLonLat([this.longitude, this.latitude]),
        zoom: this.zoom,
        enableRotation: false,
      }),
    });

    // add a custom control below default zoom
    const button = document.createElement('button');
    button.innerHTML = '↻';
    button.title = "Reset view & erase any drawings";

    const handleReset = () => {
      map.getView().setCenter(fromLonLat([this.longitude, this.latitude]));
      map.getView().setZoom(this.zoom);

      if (drawingSource) {
        drawingSource.clear();
        map.addInteraction(draw);
        map.addInteraction(snap);
      }
    };

    button.addEventListener('click', handleReset, false);

    const element = document.createElement('div');
    element.className = 'reset-control ol-unselectable ol-control';
    element.appendChild(button);

    var ResetControl = new Control({ element: element });
    map.addControl(ResetControl);

    // add a vector layer to display static geojson if features are provided
    const outlineSource = new VectorSource({
      features: new GeoJSON().readFeatures(this.geojsonData, {
        featureProjection: "EPSG:3857",
      }),
    });

    const outlineLayer = new VectorLayer({
      source: outlineSource,
      style: new Style({
        stroke: new Stroke({
          color: "#0000ff", // maybe should be configurable in future?
          width: 3,
        }),
      }),
    });

    map.addLayer(outlineLayer);

    if (this.geojsonData.features.length > 0) {
      const extent = outlineSource.getExtent();
      map.getView().fit(buffer(extent, 15)); // overrides default zoom & center
    }

    if (this.drawMode) {
      map.addLayer(drawingLayer);

      map.addInteraction(modify);
      map.addInteraction(draw);
      map.addInteraction(snap);

      // 'change' listens for 'drawend' and modifications
      drawingSource.on("change", () => {
        const sketches = drawingSource.getFeatures();

        // account for dataSource.clear() on "reset" control
        if (sketches.length > 0) {
          const lastSketchGeom = last(sketches).getGeometry();

          this.dispatch(
            "geojsonChange",
            new GeoJSON().writeFeaturesObject(sketches, {
              featureProjection: "EPSG:3857",
            })
          );
  
          this.dispatch("areaChange", formatArea(lastSketchGeom));

          // limit to drawing a single polygon
          map.removeInteraction(draw);
          map.removeInteraction(snap);
        }
      });
    }

    // XXX: force re-render for safari due to it thinking map is 0 height on load
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      target.style.opacity = "1";
      this.dispatch("ready");
    }, 500);
  }

  // render the map
  render() {
    return html`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
      <link rel="stylesheet" href="https://cdn.skypack.dev/ol@^6.6.1/ol.css" />
      <div id="map" />`;
  }

  /**
   * dispatches an event for clients to subscribe to
   * @param eventName
   * @param payload
   */
  private dispatch = (eventName: string, payload?: any) =>
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: payload,
      })
    );
}

declare global {
  interface HTMLElementTagNameMap {
    "my-map": MyMap;
  }
}
