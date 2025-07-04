import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import apply from "ol-mapbox-style";
import { defaults as defaultControls, ScaleLine } from "ol/control";
import { FeatureLike } from "ol/Feature";
import { GeoJSON } from "ol/format";
import { Geometry, Point } from "ol/geom";
import { Feature } from "ol/index";
import { defaults as defaultInteractions } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import BaseLayer from "ol/layer/Base";
import TileLayer from "ol/layer/Tile";
import VectorTileLayer from "ol/layer/VectorTile";
import Map from "ol/Map";
import { ProjectionLike, transform, transformExtent } from "ol/proj";
import { Vector as VectorSource, XYZ } from "ol/source";
import { Circle, Fill, Icon, Stroke, Style } from "ol/style";
import View from "ol/View";
import {
  northArrowControl,
  PrintControl,
  resetControl,
  scaleControl,
} from "./controls";
import {
  configureDraw,
  configureDrawingLayer,
  configureModify,
  drawingSource,
  DrawPointerEnum,
  DrawTypeEnum,
  snap,
} from "./drawing";
import pinIcon from "./icons/poi-alt.svg";
import {
  BasemapEnum,
  makeDefaultTileLayer,
  makeMapboxSatelliteBasemap,
  makeOSRasterBasemap,
  makeOsVectorTileBasemap,
} from "./layers";
import {
  getFeaturesAtPoint,
  makeFeatureLayer,
  outlineSource,
} from "./os-features";
import { proj27700, ProjectionEnum } from "./projections";
import {
  getSnapPointsFromVectorTiles,
  pointsLayer,
  pointsSource,
} from "./snapping";
import styles from "./styles.scss?inline";
import {
  AreaUnitEnum,
  calculateArea,
  fitToData,
  hexToRgba,
  makeGeoJSON,
} from "./utils";
import { GeoJSONFeatureCollection } from "ol/format/GeoJSON";

type MarkerImageEnum = "circle" | "pin";
type ResetControlImageEnum = "unicode" | "trash";

@customElement("my-map")
export class MyMap extends LitElement {
  // ref https://github.com/e111077/vite-lit-element-ts-sass/issues/3
  static styles = unsafeCSS(styles);

  // configurable component properties
  @property({ type: String })
  id = "map";

  @property({ type: String })
  dataTestId = "map-test-id";

  @property({ type: Number })
  latitude = 51.507351;

  @property({ type: Number })
  longitude = -0.127758;

  @property({ type: String })
  basemap: BasemapEnum = "OSVectorTile";

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

  @property({ type: Boolean })
  drawMany = false;

  @property({ type: String })
  drawType: DrawTypeEnum = "Polygon";

  /**
   * @deprecated - please set `drawColor` regardless of `drawType`
   */
  @property({ type: String })
  drawPointColor = "#2c2c2c";

  @property({ type: Object })
  drawGeojsonData = {
    type: "FeatureCollection",
    features: [],
  };

  @property({ type: String })
  drawGeojsonDataCopyright = "";

  @property({ type: Number })
  drawGeojsonDataBuffer = 100;

  @property({ type: String })
  drawPointer: DrawPointerEnum = "crosshair";

  @property({ type: Boolean })
  clickFeatures = false;

  @property({ type: String })
  drawColor = "#ff0000";

  /**
   * @deprecated - please set `drawColor` and fill will be automatically inferred using 20% opacity
   */
  @property({ type: String })
  drawFillColor = "rgba(255, 0, 0, 0.1)";

  @property({ type: Boolean })
  showFeaturesAtPoint = false;

  @property({ type: String })
  featureColor = "#0000ff";

  @property({ type: Boolean })
  featureFill = false;

  /**
   * @deprecated
   */
  @property({ type: Boolean })
  featureBorderNone = false;

  @property({ type: Number })
  featureBuffer = 40;

  @property({ type: Boolean })
  showCentreMarker = false;

  @property({ type: String })
  markerImage: MarkerImageEnum = "circle";

  @property({ type: Number })
  markerLatitude = this.latitude;

  @property({ type: Number })
  markerLongitude = this.longitude;

  @property({ type: String })
  markerColor = "#2c2c2c";

  @property({ type: Object })
  geojsonData: GeoJSONFeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  @property({ type: Boolean })
  showGeojsonDataMarkers = false;

  @property({ type: String })
  geojsonDataCopyright = "";

  @property({ type: String })
  geojsonColor = "#ff0000";

  @property({ type: Boolean })
  geojsonFill = false;

  @property({ type: Number })
  geojsonBuffer = 12;

  /**
   * @deprecated - please specify `basemap="OSRaster"` directly instead
   */
  @property({ type: Boolean })
  disableVectorTiles = false;

  @property({ type: String })
  osApiKey = "";

  /**
   * @deprecated - please set singular `osApiKey`
   */
  @property({ type: String })
  osVectorTilesApiKey = "";

  /**
   * @deprecated - please set singular `osApiKey`
   */
  @property({ type: String })
  osFeaturesApiKey = "";

  @property({ type: String })
  osCopyright =
    `© Crown copyright and database rights ${new Date().getFullYear()} OS <your account number>`;

  @property({ type: String })
  osProxyEndpoint = "";

  /**
   * @deprecated - please specify `basemap="MapboxSatellite"` + `mapboxAccessToken` instead
   */
  @property({ type: Boolean })
  applySatelliteStyle = false;

  @property({ type: String })
  mapboxAccessToken = "";

  @property({ type: Boolean })
  hideResetControl = false;

  @property({ type: Boolean })
  resetViewOnly = false;

  @property({ type: String })
  resetControlImage: ResetControlImageEnum = "unicode";

  @property({ type: Boolean })
  staticMode = false;

  /**
   * @deprecated - both `area.squareMetres` & `area.hectares` are calculated by default now in applicable `geojsonChange` events
   */
  @property({ type: String })
  areaUnit: AreaUnitEnum = "m2";

  @property({ type: Boolean })
  hideDrawLabels = false;

  @property({ type: Boolean })
  showScale = false;

  @property({ type: Boolean })
  useScaleBarStyle = false;

  @property({ type: Boolean })
  showNorthArrow = false;

  @property({ type: Boolean })
  showPrint = false;

  @property({ type: Boolean })
  collapseAttributions = false;

  @property({ type: Object })
  clipGeojsonData = {
    type: "Feature",
    geometry: {
      coordinates: [],
    },
  };

  @property({ type: String })
  ariaLabelOlFixedOverlay = "";

  // set class property (map doesn't require any reactivity using @state)
  map?: Map;

  // called when element is created
  constructor() {
    super();
  }

  // runs after the initial render
  firstUpdated() {
    const target = this.renderRoot.querySelector(`#${this.id}`) as HTMLElement;

    const isUsingOS = Boolean(this.osApiKey || this.osProxyEndpoint);

    const basemapLayers: BaseLayer[] = [];
    let osVectorTileBasemap: VectorTileLayer | undefined,
      osRasterBasemap: TileLayer<XYZ> | undefined,
      mapboxSatelliteBasemap:
        | VectorLayer<VectorSource<Feature<Geometry>>, Feature<Geometry>>
        | undefined;

    if (this.basemap === "OSVectorTile" && isUsingOS) {
      osVectorTileBasemap = makeOsVectorTileBasemap(
        this.osApiKey,
        this.osProxyEndpoint,
        this.osCopyright,
      );
      basemapLayers.push(osVectorTileBasemap);
    } else if (this.basemap === "OSRaster" && isUsingOS) {
      osRasterBasemap = makeOSRasterBasemap(
        this.osApiKey,
        this.osProxyEndpoint,
        this.osCopyright,
      );
      basemapLayers.push(osRasterBasemap);
    } else if (
      this.basemap === "MapboxSatellite" &&
      Boolean(this.mapboxAccessToken)
    ) {
      mapboxSatelliteBasemap = makeMapboxSatelliteBasemap();
      basemapLayers.push(mapboxSatelliteBasemap);
    } else if (this.basemap === "OSM" || basemapLayers.length === 0) {
      // Fallback to OpenStreetMap if we've failed to make any of the above layers, or if it's set directly
      const osmBasemap = makeDefaultTileLayer();
      basemapLayers.push(osmBasemap);
    }

    // @ts-ignore
    const projection: ProjectionLike =
      this.projection === "EPSG:27700" && Boolean(proj27700)
        ? proj27700
        : this.projection;
    const centerCoordinate = transform(
      [this.longitude, this.latitude],
      projection,
      "EPSG:3857",
    );

    const clipFeature =
      this.clipGeojsonData.geometry?.coordinates?.length > 0 &&
      new GeoJSON().readFeature(this.clipGeojsonData, {
        featureProjection: "EPSG:3857",
      });
    const clipExtent =
      clipFeature &&
      !Array.isArray(clipFeature) &&
      clipFeature.getGeometry()?.getExtent();

    const map = new Map({
      target,
      layers: basemapLayers,
      view: new View({
        projection: "EPSG:3857",
        extent: clipExtent
          ? clipExtent
          : transformExtent(
              // UK Boundary
              [-10.76418, 49.528423, 1.9134116, 61.331151],
              "EPSG:4326",
              "EPSG:3857",
            ),
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        center: centerCoordinate,
        zoom: this.zoom,
        enableRotation: false,
      }),
      controls: defaultControls({
        attribution: true,
        attributionOptions: {
          collapsed: this.collapseAttributions,
        },
        zoom: !this.staticMode,
        rotate: false, // alternatively uses custom prop `showNorthArrow`
      }),
      interactions: defaultInteractions({
        doubleClickZoom: !this.staticMode,
        dragPan: !this.staticMode,
        mouseWheelZoom: !this.staticMode,
      }),
    });

    this.map = map;

    if (this.basemap === "MapboxSatellite" && mapboxSatelliteBasemap) {
      apply(
        map,
        `https://api.mapbox.com/styles/v1/mapbox/satellite-v9?access_token=${this.mapboxAccessToken}`,
      );
    }

    // Append to global window for reference in tests
    window.olMap = import.meta.env.VITEST ? this.map : undefined;

    // make configurable interactions available
    const draw = configureDraw(this.drawType, this.drawPointer, this.drawColor);
    const modify = configureModify(this.drawPointer, this.drawColor);

    // Add a custom 'reset' control to the map
    const handleReset = () => {
      // Reset the view port of the map based on available data or center/zoom by default
      if (this.showFeaturesAtPoint) {
        fitToData(map, outlineSource, this.featureBuffer);
      } else if (geojsonSource.getFeatures().length > 0) {
        fitToData(map, geojsonSource, this.geojsonBuffer);
      } else if (this.resetViewOnly && drawingSource.getFeatures().length > 0) {
        fitToData(map, drawingSource, this.drawGeojsonDataBuffer);
      } else {
        map.getView().setCenter(centerCoordinate);
        map.getView().setZoom(this.zoom);
      }

      // If in drawMode, also clear features from the drawingSource by default
      if (this.drawMode && !this.resetViewOnly) {
        drawingSource.clear();
        this.dispatch("geojsonChange", {});
        map.addInteraction(draw);
        map.addInteraction(snap);
      }
    };

    if (!this.hideResetControl) {
      map.addControl(resetControl(handleReset, this.resetControlImage));
    }

    // add custom scale line and north arrow controls to the map
    let scale: ScaleLine;
    if (this.showNorthArrow) {
      map.addControl(northArrowControl());
    }

    if (this.showScale) {
      scale = scaleControl(this.useScaleBarStyle);
      map.addControl(scale);
    }

    if (this.showPrint) {
      const printControl = new PrintControl({ map });
      map.addControl(printControl);
    }

    // Apply aria-labels to OL Controls for accessibility
    const olControls: NodeListOf<HTMLButtonElement> | undefined =
      this.renderRoot?.querySelectorAll(".ol-control button");
    olControls?.forEach((node) =>
      node.setAttribute("aria-label", node.getAttribute("title") || ""),
    );

    // Apply aria-controls to attribution button for accessibility
    const olAttributionButton: NodeListOf<HTMLButtonElement> | undefined =
      this.renderRoot?.querySelectorAll(".ol-attribution button");
    olAttributionButton?.forEach((node) =>
      node.setAttribute("aria-controls", "ol-attribution-list"),
    );

    // Apply ID to attribution list for accessibility
    const olList: NodeListOf<HTMLElement> | undefined =
      this.renderRoot?.querySelectorAll(".ol-attribution ul");
    olList?.forEach((node) => node.setAttribute("id", "ol-attribution-list"));

    // Re-order overlay elements so that OL Attribution is final element
    //   making OL Controls first in natural tab order for accessibility
    const olAttribution = this.renderRoot?.querySelector(
      ".ol-attribution",
    ) as Node;
    const olOverlay = this.renderRoot?.querySelector(
      ".ol-overlaycontainer-stopevent",
    );
    olOverlay?.append(olAttribution);

    // define cursors for dragging/panning and moving
    map.on("pointerdrag", () => {
      map.getViewport().style.cursor = "grabbing";
    });

    map.on("pointermove", () => {
      map.getViewport().style.cursor = "grab";
    });

    // Display static GeoJSON if features are provided
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

      if (Array.isArray(feature)) return;

      geojsonSource.addFeature(feature);
    }

    geojsonSource.setAttributions(this.geojsonDataCopyright);

    const geojsonLayer = new VectorLayer({
      source: geojsonSource,
      style: function (this: MyMap, feature: FeatureLike) {
        // Read color from geojson feature `properties` if set or fallback to prop
        let featureColor = feature.get("color") || this.geojsonColor;
        return new Style({
          stroke: new Stroke({
            color: featureColor,
            width: 3,
          }),
          fill: new Fill({
            color: this.geojsonFill
              ? hexToRgba(featureColor, 0.2)
              : hexToRgba(featureColor, 0),
          }),
          image: new Circle({
            radius: 10,
            fill: new Fill({ color: featureColor }),
          }),
        });
      }.bind(this),
    });

    map.addLayer(geojsonLayer);
    geojsonLayer.setZIndex(1001);

    if (geojsonSource.getFeatures().length > 0) {
      // fit map to extent of geojson features, overriding default zoom & center
      fitToData(map, geojsonSource, this.geojsonBuffer);

      // log total area of static geojson data (assumes single polygon for now)
      const data = geojsonSource.getFeatures()[0].getGeometry();
      if (data) {
        this.dispatch("geojsonDataArea", calculateArea(data, this.areaUnit));
      }
    }

    // draw interactions
    const drawingLayer = configureDrawingLayer(
      this.drawType,
      this.drawColor,
      this.drawMany,
      this.hideDrawLabels,
    );
    if (this.drawMode) {
      // Clear drawingSource to begin, even if drawGeojsonData is provided
      drawingSource.clear();

      // Load initial drawing (or drawings if drawMany) into the drawing source
      if (this.drawGeojsonData.type === "FeatureCollection") {
        let features = new GeoJSON().readFeatures(this.drawGeojsonData, {
          featureProjection: "EPSG:3857",
        });
        drawingSource.addFeatures(features);
      } else if (this.drawGeojsonData.type === "Feature") {
        let feature = new GeoJSON().readFeature(this.drawGeojsonData, {
          featureProjection: "EPSG:3857",
        });

        if (Array.isArray(feature)) return;

        drawingSource.addFeature(feature);
      }

      drawingSource.setAttributions(this.drawGeojsonDataCopyright);
      if (drawingSource.getFeatures().length > 0) {
        fitToData(map, drawingSource, this.drawGeojsonDataBuffer);
      }

      map.addLayer(drawingLayer);
      drawingLayer.setZIndex(1001); // Ensure drawing layer is on top of Mapbox Satellite style

      // If exactly one drawGeojsonData feature was initially provided, and we are NOT supporting drawMany, only add modify interaction to map, else add draw & modify
      const modifyOnly =
        drawingSource.getFeatures().length === 1 && !this.drawMany;
      if (!modifyOnly) {
        map.addInteraction(draw);
      }
      map.addInteraction(modify);

      // Snap must be added after draw and modify
      map.addInteraction(snap);

      // 'change' listens for 'drawend' and modifications
      drawingSource.on("change", () => {
        const sketches = drawingSource.getFeatures();

        // Assign a label to each feature based on its' index
        sketches.forEach((sketch) => {
          // If this feature already exists and is only being modified, use its' current label, else use feature length (needs to be type string in order to be parsed by Style "Text")
          const label = sketch.get("label") || `${sketches.length}`;
          sketch.set("label", label);
        });

        if (sketches.length > 0) {
          if (this.drawType === "Polygon") {
            // Calculate the "area" and set on geojson `properties`
            sketches.forEach((sketch) => {
              const sketchGeom = sketch.getGeometry();
              if (sketchGeom) {
                sketch.set(
                  "area.squareMetres",
                  calculateArea(sketchGeom, "m2"),
                );
                sketch.set("area.hectares", calculateArea(sketchGeom, "ha"));
              }
            });
          }

          this.dispatch("geojsonChange", {
            "EPSG:3857": makeGeoJSON(sketches, "EPSG:3857"),
            "EPSG:27700": makeGeoJSON(sketches, "EPSG:27700"),
          });

          // Unless specified, limit to drawing a single feature, still allowing modifications
          if (!this.drawMany) {
            map.removeInteraction(draw);
          }
        }
      });
    }

    // show snapping points when in boundary drawMode, with vector tile basemap enabled, and at qualifying zoom
    if (
      this.drawMode &&
      this.drawType === "Polygon" &&
      this.basemap === "OSVectorTile" &&
      osVectorTileBasemap
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
          getSnapPointsFromVectorTiles(osVectorTileBasemap, extent);
        }
      };

      // Wait for all vector tiles to finish loading before extracting points from them
      map.on("loadend", addSnapPoints);

      // Update snap points when appropriate
      // Timeout minimizes updates mid-pan/drag
      map.on("moveend", () => {
        const isSourceLoaded =
          osVectorTileBasemap.getSource()?.getState() === "ready";
        if (isSourceLoaded) setTimeout(addSnapPoints, 200);
      });
    }

    // OS Features API & click-to-select interactions
    const isUsingOSFeatures = isUsingOS && this.showFeaturesAtPoint;
    if (isUsingOSFeatures) {
      getFeaturesAtPoint(
        centerCoordinate,
        this.osApiKey,
        this.osProxyEndpoint,
        false,
      );

      if (this.clickFeatures) {
        map.on("singleclick", (e) => {
          getFeaturesAtPoint(
            e.coordinate,
            this.osApiKey,
            this.osProxyEndpoint,
            true,
          );
        });
      }

      const outlineLayer = makeFeatureLayer(
        this.featureColor,
        this.featureFill,
      );
      map.addLayer(outlineLayer);

      // Ensure getFeaturesAtPoint has fetched successfully
      outlineSource.on("change", () => {
        if (
          outlineSource.getState() === "ready" &&
          outlineSource.getFeatures().length > 0
        ) {
          // Fit map to extent of features
          fitToData(map, outlineSource, this.featureBuffer);

          // Calculate the total area of the feature or merged features and set on geojson `properties`
          const osFeatures = outlineSource.getFeatures();
          if (osFeatures.length > 0) {
            osFeatures.forEach((osFeature) => {
              const osFeatureGeom = osFeature.getGeometry();
              if (osFeatureGeom) {
                osFeature.set(
                  "area.squareMetres",
                  calculateArea(osFeatureGeom, "m2"),
                );
                osFeature.set(
                  "area.hectares",
                  calculateArea(osFeatureGeom, "ha"),
                );
              }
            });
          }

          // Dispatch the geojson of the feature or merged features
          this.dispatch("featuresGeojsonChange", {
            "EPSG:3857": makeGeoJSON(outlineSource, "EPSG:3857"),
            "EPSG:27700": makeGeoJSON(outlineSource, "EPSG:27700"),
          });
        }
      });
    }

    const markerCircle = new Circle({
      radius: 10,
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

    const showNewMarker = (lon: number, lat: number) => {
      const markerPoint = new Point(
        transform([lon, lat], projection, "EPSG:3857"),
      );
      const markerLayer = new VectorLayer({
        source: new VectorSource({
          features: [new Feature(markerPoint)],
        }),
        style: new Style({ image: markerImage() }),
      });

      map.addLayer(markerLayer);
      markerLayer.setZIndex(1001);
    };

    // show a marker at a point
    if (this.showCentreMarker) {
      showNewMarker(this.markerLongitude, this.markerLatitude);
    }

    if (this.showGeojsonDataMarkers) {
      this.geojsonData.features.forEach((feature) => {
        if (feature.geometry.type !== "Point") return;

        showNewMarker(
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        );
      });
    }

    // Add an aria-label to the overlay canvas for accessibility
    const olCanvas = this.renderRoot?.querySelector("canvas.ol-fixedoverlay");
    olCanvas?.setAttribute("aria-label", this.ariaLabelOlFixedOverlay);

    // XXX: force re-render for safari due to it thinking map is 0 height on load
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      target.style.opacity = "1";
      this.dispatch("ready");
    }, 500);
  }

  // render the map
  render() {
    return html`<link
        rel="stylesheet"
        href="https://cdn.skypack.dev/ol@^6.6.1/ol.css"
      />
      <div
        id="${this.id}"
        class="map"
        role="${this.staticMode && !this.collapseAttributions
          ? "presentation"
          : "application"}"
        tabindex="${this.staticMode && !this.collapseAttributions ? -1 : 0}"
        data-testid="${this.dataTestId}"
      />`;
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
      }),
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
