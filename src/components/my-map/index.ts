import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Control, defaults as defaultControls } from "ol/control";
import { Point } from "ol/geom";
import { GeoJSON } from "ol/format";
import { Feature } from "ol/index";
import { defaults as defaultInteractions } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import Map from "ol/Map";
import { ProjectionLike, transform, transformExtent } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import { Circle, Fill, Stroke, Style, Icon } from "ol/style";
import View from "ol/View";
import { last } from "rambda";

import {
  configureDraw,
  configureModify,
  drawingLayer,
  drawingSource,
  DrawPointerEnum,
  snap,
} from "./drawing";
import {
  getFeaturesAtPoint,
  makeFeatureLayer,
  outlineSource,
} from "./os-features";
import { makeOsVectorTileBaseMap, makeRasterBaseMap } from "./os-layers";
import { proj27700, ProjectionEnum } from "./projections";
import { scaleControl, northArrowControl } from "./controls";
import {
  getSnapPointsFromVectorTiles,
  pointsLayer,
  pointsSource,
} from "./snapping";
import { AreaUnitEnum, fitToData, formatArea, hexToRgba } from "./utils";
import styles from "./styles.scss";
import pinIcon from "./icons/poi-alt.svg";

type MarkerImageEnum = "circle" | "pin";

@customElement("my-map")
export class MyMap extends LitElement {
  // ref https://github.com/e111077/vite-lit-element-ts-sass/issues/3
  static styles = unsafeCSS(styles);

  // configurable component properties
  @property({ type: String })
  id = "map";

  @property({ type: Number })
  latitude = 51.507351;

  @property({ type: Number })
  longitude = -0.127758;

  @property({ type: String })
  projection: ProjectionEnum = "EPSG:4326";

  @property({ type: Number })
  zoom = 10;

  @property({ type: Number })
  minZoom = 7;

  @property({ type: Number })
  maxZoom = 22;

  @property({ type: Boolean })
  drawMode = false;

  @property({ type: Object })
  drawGeojsonData = {
    type: "Feature",
    geometry: {},
  };

  @property({ type: Number })
  drawGeojsonDataBuffer = 100;

  @property({ type: String })
  drawPointer: DrawPointerEnum = "crosshair";

  @property({ type: Boolean })
  showFeaturesAtPoint = false;

  @property({ type: Boolean })
  clickFeatures = false;

  @property({ type: String })
  featureColor = "#0000ff";

  @property({ type: Boolean })
  featureFill = false;

  @property({ type: Boolean })
  featureBorderNone = false;

  @property({ type: Number })
  featureBuffer = 40;

  @property({ type: Boolean })
  showMarker = false;

  @property({ type: String })
  markerImage: MarkerImageEnum = "circle";

  @property({ type: Number })
  markerLatitude = this.latitude;

  @property({ type: Number })
  markerLongitude = this.longitude;

  @property({ type: String })
  markerColor = "#000000";

  @property({ type: Object })
  geojsonData = {
    type: "FeatureCollection",
    features: [],
  };

  @property({ type: String })
  geojsonColor = "#ff0000";

  @property({ type: Boolean })
  geojsonFill = false;

  @property({ type: Number })
  geojsonBuffer = 12;

  @property({ type: Boolean })
  disableVectorTiles = false;

  @property({ type: String })
  osVectorTilesApiKey = import.meta.env.VITE_APP_OS_VECTOR_TILES_API_KEY || "";

  @property({ type: String })
  osFeaturesApiKey = import.meta.env.VITE_APP_OS_FEATURES_API_KEY || "";

  @property({ type: String })
  osCopyright = `© Crown copyright and database rights ${new Date().getFullYear()} OS (0)100024857`;

  @property({ type: Boolean })
  hideResetControl = false;

  @property({ type: Boolean })
  staticMode = false;

  @property({ type: String })
  areaUnit: AreaUnitEnum = "m2";

  @property({ type: Boolean })
  showScale = false;

  @property({ type: Boolean })
  useScaleBarStyle = false;

  @property({ type: Boolean })
  showNorthArrow = false;

  // set class property (map doesn't require any reactivity using @state)
  map?: Map;

  // called when element is created
  constructor() {
    super();
  }

  // runs after the initial render
  firstUpdated() {
    const target = this.renderRoot.querySelector(`#${this.id}`) as HTMLElement;

    const useVectorTiles =
      !this.disableVectorTiles && Boolean(this.osVectorTilesApiKey);

    const rasterBaseMap = makeRasterBaseMap(
      this.osCopyright,
      this.osVectorTilesApiKey
    );
    const osVectorTileBaseMap = makeOsVectorTileBaseMap(
      this.osCopyright,
      this.osVectorTilesApiKey
    );

    // @ts-ignore
    const projection: ProjectionLike =
      this.projection === "EPSG:27700" && Boolean(proj27700)
        ? proj27700
        : this.projection;
    const centerCoordinate = transform(
      [this.longitude, this.latitude],
      projection,
      "EPSG:3857"
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
        center: centerCoordinate,
        zoom: this.zoom,
        enableRotation: false,
      }),
      controls: defaultControls({
        attribution: true,
        zoom: !this.staticMode,
      }),
      interactions: defaultInteractions({
        doubleClickZoom: !this.staticMode,
        dragPan: !this.staticMode,
        mouseWheelZoom: !this.staticMode,
      }),
    });

    this.map = map;

    // Append to global window for reference in tests
    window.olMap = import.meta.env.VITEST ? this.map : undefined;

    // make configurable interactions available
    const draw = configureDraw(this.drawPointer);
    const modify = configureModify(this.drawPointer);

    // add custom scale line and north arrow controls to the map
    if (this.showScale) {
      map.addControl(scaleControl(this.useScaleBarStyle));
    }

    if (this.showNorthArrow) {
      map.addControl(northArrowControl());
    }

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
        map.getView().setCenter(centerCoordinate);
        map.getView().setZoom(this.zoom);
      }

      if (this.drawMode) {
        drawingSource.clear();

        this.dispatch("geojsonChange", {});
        this.dispatch(
          "areaChange",
          `0 ${this.areaUnit === "m2" ? "m²" : this.areaUnit}`
        );

        map.addInteraction(draw);
        map.addInteraction(snap);
      }
    };

    // this is an internal event listener, so doesn't need to be removed later
    // ref https://lit.dev/docs/components/lifecycle/#disconnectedcallback
    button.addEventListener("click", handleReset, false);

    const element = document.createElement("div");
    element.className = "reset-control ol-unselectable ol-control";
    element.appendChild(button);

    const ResetControl = new Control({ element: element });

    if (!this.hideResetControl) {
      map.addControl(ResetControl);
    }

    // Apply aria-labels to OL Controls for accessibility
    const olControls: NodeListOf<HTMLButtonElement> | undefined =
      this.renderRoot?.querySelectorAll(".ol-control button");
    olControls?.forEach((node) =>
      node.setAttribute("aria-label", node.getAttribute("title") || "")
    );

    // define cursors for dragging/panning and moving
    map.on("pointerdrag", () => {
      map.getViewport().style.cursor = "grabbing";
    });

    map.on("pointermove", () => {
      map.getViewport().style.cursor = "grab";
    });

    // display static geojson if features are provided
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
        fill: new Fill({
          color: this.geojsonFill
            ? hexToRgba(this.geojsonColor, 0.2)
            : hexToRgba(this.geojsonColor, 0),
        }),
      }),
    });

    map.addLayer(geojsonLayer);

    if (geojsonSource.getFeatures().length > 0) {
      // fit map to extent of geojson features, overriding default zoom & center
      fitToData(map, geojsonSource, this.geojsonBuffer);

      // log total area of static geojson data (assumes single polygon for now)
      const data = geojsonSource.getFeatures()[0].getGeometry();
      if (data) {
        this.dispatch("geojsonDataArea", formatArea(data, this.areaUnit));
      }
    }

    // draw interactions
    if (this.drawMode) {
      // make sure drawingSource is cleared upfront, even if drawGeojsonData is provided
      drawingSource.clear();

      // load an initial polygon into the drawing source if provided, or start from an empty drawing source
      const loadInitialDrawing =
        Object.keys(this.drawGeojsonData.geometry).length > 0;

      if (loadInitialDrawing) {
        let feature = new GeoJSON().readFeature(this.drawGeojsonData, {
          featureProjection: "EPSG:3857",
        });
        drawingSource.addFeature(feature);
        fitToData(map, drawingSource, this.drawGeojsonDataBuffer);
      }

      map.addLayer(drawingLayer);

      if (!loadInitialDrawing) {
        map.addInteraction(draw);
      }
      map.addInteraction(modify);

      // XXX: snap must be added after draw and modify
      map.addInteraction(snap);

      // 'change' listens for 'drawend' and modifications
      drawingSource.on("change", () => {
        const sketches = drawingSource.getFeatures();

        if (sketches.length > 0) {
          const lastSketchGeom = last(sketches)?.getGeometry();

          this.dispatch(
            "geojsonChange",
            new GeoJSON().writeFeaturesObject(sketches, {
              featureProjection: "EPSG:3857",
            })
          );

          if (lastSketchGeom) {
            this.dispatch(
              "areaChange",
              formatArea(lastSketchGeom, this.areaUnit)
            );
          }

          // limit to drawing a single polygon, only allow modifications to existing shape
          map.removeInteraction(draw);
        }
      });
    }

    // show snapping points when in drawMode, with vector tile basemap enabled, and at qualifying zoom
    if (
      this.drawMode &&
      Boolean(this.osVectorTilesApiKey) &&
      !this.disableVectorTiles
    ) {
      // define zoom threshold for showing snaps (not @property yet because computationally expensive!)
      const snapsZoom: number = 20;

      // display draw vertices on top of snap points
      map.addLayer(pointsLayer);
      drawingLayer.setZIndex(1001);

      // extract snap-able points from the basemap, and display them as points on the map if initial render within zoom
      const addSnapPoints = (): void => {
        pointsSource.clear();
        const currentZoom: number | undefined = map.getView().getZoom();
        if (currentZoom && currentZoom >= snapsZoom) {
          const extent = map.getView().calculateExtent(map.getSize());
          getSnapPointsFromVectorTiles(osVectorTileBaseMap, extent);
        }
      };

      // Wait for all vector tiles to finish loading before extracting points from them
      map.on("loadend", addSnapPoints);

      // Update snap points when appropriate
      // Timeout minimizes updates mid-pan/drag
      map.on("moveend", () => {
        const isSourceLoaded =
          osVectorTileBaseMap.getSource()?.getState() === "ready";
        if (isSourceLoaded) setTimeout(addSnapPoints, 200);
      });
    }

    // OS Features API & click-to-select interactions
    if (this.showFeaturesAtPoint && Boolean(this.osFeaturesApiKey)) {
      getFeaturesAtPoint(centerCoordinate, this.osFeaturesApiKey, false);

      if (this.clickFeatures) {
        map.on("singleclick", (e) => {
          getFeaturesAtPoint(e.coordinate, this.osFeaturesApiKey, true);
        });
      }

      const outlineLayer = makeFeatureLayer(
        this.featureColor,
        this.featureFill,
        this.featureBorderNone
      );
      map.addLayer(outlineLayer);

      // ensure getFeaturesAtPoint has fetched successfully
      outlineSource.on("change", () => {
        if (
          outlineSource.getState() === "ready" &&
          outlineSource.getFeatures().length > 0
        ) {
          // fit map to extent of features
          fitToData(map, outlineSource, this.featureBuffer);

          // write the geojson representation of the feature or merged features
          this.dispatch(
            "featuresGeojsonChange",
            new GeoJSON().writeFeaturesObject(outlineSource.getFeatures(), {
              featureProjection: "EPSG:3857",
            })
          );

          // calculate the total area of the feature or merged features
          const data = outlineSource.getFeatures()[0].getGeometry();
          if (data) {
            this.dispatch(
              "featuresAreaChange",
              formatArea(data, this.areaUnit)
            );
          }
        }
      });
    }

    const markerCircle = new Circle({
      radius: 9,
      fill: new Fill({ color: this.markerColor }),
    });

    const markerPin = new Icon({ src: pinIcon, scale: 0.5 });

    const markerImage = () => {
      switch (this.markerImage) {
        case "circle":
          return markerCircle;
        case "pin":
          return markerPin;
      }
    };

    // show a marker at a point
    if (this.showMarker) {
      const markerPoint = new Point(
        transform(
          [this.markerLongitude, this.markerLatitude],
          projection,
          "EPSG:3857"
        )
      );
      const markerLayer = new VectorLayer({
        source: new VectorSource({
          features: [new Feature(markerPoint)],
        }),
        style: new Style({ image: markerImage() }),
      });

      map.addLayer(markerLayer);
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
      <div id="${this.id}" class="map" tabindex="0" />`;
  }

  // unmount the map
  disconnectedCallback() {
    super.disconnectedCallback();
    this.map?.dispose();
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
  interface Window {
    olMap: Map | undefined;
  }
  interface HTMLElementTagNameMap {
    "my-map": MyMap;
  }
}
