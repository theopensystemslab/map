import { css, customElement, html, LitElement, property } from "lit-element";
import stylefunction from "ol-mapbox-style/dist/stylefunction";
import { Draw, Modify, Snap } from "ol/interaction";
import Map from "ol/Map";
import { fromLonLat, transformExtent } from "ol/proj";
import View from "ol/View";
import { drawingLayer, drawingSource, formatArea } from "./draw";
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

  private useVectorTiles =
    Boolean(import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY) &&
    osVectorTileBaseMap;

  // runs after the initial render
  firstUpdated() {
    const target = this.shadowRoot?.querySelector("#map") as HTMLElement;

    // apply style to OS vector tile layer if applicable
    // ref https://github.com/openlayers/ol-mapbox-style#usage-example
    if (this.useVectorTiles) {
      const vectorTileStyleUrl = `https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${
        import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY
      }`;

      fetch(vectorTileStyleUrl)
        .then((response) => response.json())
        .then((glStyle) => stylefunction(osVectorTileBaseMap, glStyle, "esri"))
        .catch(console.error);
    }

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
      }),
    });

    if (this.drawMode) {
      map.addLayer(drawingLayer);

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

      // 'change' ensures getFeatures() isn't empty and listens for modifications; 'drawend' does not
      drawingSource.on("change", () => {
        let sketches = drawingSource.getFeatures();
        let last_sketch_geom =
          sketches[sketches.length - 1]["values_"].geometry;

        this.dispatch("areaChange", formatArea(last_sketch_geom));
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
  private dispatch = (eventName: string, payload = undefined) =>
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
