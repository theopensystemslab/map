import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Feature } from "ol";
import { Control, defaults as defaultControls } from "ol/control";
import { GeoJSON } from "ol/format";
import Point from "ol/geom/Point";
import { defaults as defaultInteractions } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import Map from "ol/Map";
import { fromLonLat, transformExtent } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import View from "ol/View";
import { last, splitEvery } from "rambda";
import { draw, drawingLayer, drawingSource, modify, snap } from "./draw";
import {
  getFeaturesAtPoint,
  makeFeatureLayer,
  outlineSource,
} from "./os-features";
import { makeOsVectorTileBaseMap, makeRasterBaseMap } from "./os-layers";
import { scaleControl } from "./scale-line";
import { pointsSource } from "./snapping";
import { AreaUnitEnum, fitToData, formatArea } from "./utils";
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
    #map:focus {
      outline: #424242 solid 0.15em;
    }
    .reset-control {
      top: 70px;
      left: 0.5em;
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
  drawMode = false;

  @property({ type: Boolean })
  showFeaturesAtPoint = false;

  @property({ type: Boolean })
  clickFeatures = false;

  @property({ type: String })
  featureColor = "#0000ff";

  @property({ type: Number })
  featureBuffer = 40;

  @property({ type: Object })
  geojsonData = {
    type: "FeatureCollection",
    features: [],
  };

  @property({ type: String })
  geojsonColor = "#ff0000";

  @property({ type: Number })
  geojsonBuffer = 12;

  @property({ type: Boolean })
  disableVectorTiles = false;

  @property({ type: String })
  osVectorTilesApiKey = import.meta.env.VITE_APP_OS_VECTOR_TILES_API_KEY || "";

  @property({ type: String })
  osFeaturesApiKey = import.meta.env.VITE_APP_OS_FEATURES_API_KEY || "";

  @property({ type: Boolean })
  hideResetControl = false;

  @property({ type: Boolean })
  staticMode = false;

  @property({ type: String })
  areaUnit: AreaUnitEnum = "m2";

  @property({ type: String })
  ariaLabel = "Interactive map";

  @property({ type: Boolean })
  showScale = false;

  @property({ type: Boolean })
  useScaleBarStyle = false;

  // runs after the initial render
  firstUpdated() {
    const target = this.shadowRoot?.querySelector("#map") as HTMLElement;

    const useVectorTiles =
      !this.disableVectorTiles && Boolean(this.osVectorTilesApiKey);

    const rasterBaseMap = makeRasterBaseMap(this.osVectorTilesApiKey);
    const osVectorTileBaseMap = makeOsVectorTileBaseMap(
      this.osVectorTilesApiKey
    );

    const map = new Map({
      target,
      layers: [useVectorTiles ? osVectorTileBaseMap : rasterBaseMap],
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
      controls: defaultControls({
        attribution: true,
        zoom: !this.staticMode,
      }).extend(this.showScale ? [scaleControl(this.useScaleBarStyle)] : []),
      interactions: defaultInteractions({
        doubleClickZoom: !this.staticMode,
        dragPan: !this.staticMode,
        mouseWheelZoom: !this.staticMode,
      }),
    });

    // add a custom 'reset' control below zoom
    const button = document.createElement("button");
    button.innerHTML = "↻";
    button.title = "Reset map view";

    const handleReset = () => {
      if (this.showFeaturesAtPoint) {
        fitToData(map, outlineSource, this.featureBuffer);
      } else if (geojsonSource.getFeatures().length > 0) {
        fitToData(map, geojsonSource, this.geojsonBuffer);
      } else {
        map.getView().setCenter(fromLonLat([this.longitude, this.latitude]));
        map.getView().setZoom(this.zoom);
      }

      if (this.drawMode) {
        drawingSource.clear();
        map.addInteraction(draw);
        map.addInteraction(snap);
      }
    };

    button.addEventListener("click", handleReset, false);

    const element = document.createElement("div");
    element.className = "reset-control ol-unselectable ol-control";
    element.appendChild(button);

    var ResetControl = new Control({ element: element });

    if (!this.hideResetControl) {
      map.addControl(ResetControl);
    }

    // define cursors for dragging/panning and moving
    map.on("pointerdrag", () => {
      map.getViewport().style.cursor = "grabbing";
    });

    map.on("pointermove", () => {
      map.getViewport().style.cursor = "grab";
    });

    const pointsLayer = new VectorLayer({
      source: pointsSource,
      style: function () {
        return new Style({
          image: new CircleStyle({
            radius: 4,
            fill: new Fill({ color: "green" }),
          }),
        });
      },
    });
    map.addLayer(pointsLayer);

    map.on("moveend", () => {
      if (map.getView().getZoom() < 19) return;

      const extent = map.getView().calculateExtent(map.getSize());
      const points = osVectorTileBaseMap
        .getSource()
        .getFeaturesInExtent(extent)
        .filter((x) => x.getGeometry().getType() === "Polygon")
        .flatMap((x: any) => x.flatCoordinates_);

      pointsSource.clear();

      (splitEvery(2, points) as [number, number][]).forEach((pair, i) => {
        pointsSource.addFeature(
          new Feature({
            geometry: new Point(pair),
            i,
          })
        );
      });
    });

    // add a vector layer to display static geojson if features are provided
    const geojsonSource = new VectorSource();

    if (this.geojsonData.type === "FeatureCollection") {
      let features = new GeoJSON().readFeatures(this.geojsonData, {
        featureProjection: "EPSG:3857",
      });
      geojsonSource.addFeatures(features);
    } else if (this.geojsonData.type === "Feature") {
      let feature = new GeoJSON().readFeature(this.geojsonData, {
        featureProjection: "EPSG:3857",
      });
      geojsonSource.addFeature(feature);
    }

    const geojsonLayer = new VectorLayer({
      source: geojsonSource,
      style: new Style({
        stroke: new Stroke({
          color: this.geojsonColor,
          width: 3,
        }),
      }),
    });

    map.addLayer(geojsonLayer);

    if (geojsonSource.getFeatures().length > 0) {
      // fit map to extent of geojson features, overriding default zoom & center
      fitToData(map, geojsonSource, this.geojsonBuffer);

      // log total area of first feature (assumes geojson is a single polygon for now)
      const data = geojsonSource.getFeatures()[0].getGeometry();
      console.log("geojsonData total area:", formatArea(data, this.areaUnit));
    }

    if (this.drawMode) {
      // ensure we start from an empty array of features
      drawingSource.clear();
      map.addLayer(drawingLayer);

      map.addInteraction(draw);
      map.addInteraction(snap);
      map.addInteraction(modify);

      // 'change' listens for 'drawend' and modifications
      drawingSource.on("change", () => {
        const sketches = drawingSource.getFeatures();

        if (sketches.length > 0) {
          const lastSketchGeom = last(sketches).getGeometry();

          this.dispatch(
            "geojsonChange",
            new GeoJSON().writeFeaturesObject(sketches, {
              featureProjection: "EPSG:3857",
            })
          );

          this.dispatch(
            "areaChange",
            formatArea(lastSketchGeom, this.areaUnit)
          );

          // limit to drawing a single polygon, only allow modifications to existing shape
          map.removeInteraction(draw);
          map.removeInteraction(snap);
        }
      });
    }

    if (this.showFeaturesAtPoint && Boolean(this.osFeaturesApiKey)) {
      getFeaturesAtPoint(
        fromLonLat([this.longitude, this.latitude]),
        this.osFeaturesApiKey
      );

      if (this.clickFeatures) {
        map.on("singleclick", (e) => {
          getFeaturesAtPoint(e.coordinate, this.osFeaturesApiKey);
        });
      }

      const outlineLayer = makeFeatureLayer(this.featureColor);
      map.addLayer(outlineLayer);

      // ensure getFeaturesAtPoint has fetched successfully
      outlineSource.on("change", () => {
        if (
          outlineSource.getState() === "ready" &&
          outlineSource.getFeatures().length > 0
        ) {
          // fit map to extent of features
          fitToData(map, outlineSource, this.featureBuffer);

          // log total area of feature or merged features
          const data = outlineSource.getFeatures()[0].getGeometry();
          console.log(
            "feature(s) total area:",
            formatArea(data, this.areaUnit)
          );
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
      <div id="map" tabindex="0" aria-label=${this.ariaLabel} />`;
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
