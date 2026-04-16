import type { Meta, StoryObj } from "@storybook/web-components";
import "../../index";

// Populated automatically when VITE_APP_OS_API_KEY is set in .env
const osApiKey = import.meta.env.VITE_APP_OS_API_KEY ?? "";

const meta: Meta = {
  title: "Components/MyMap",
  component: "my-map",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "MyMap is an OpenLayers-powered Lit web component map for tasks related to planning permission in the UK.",
      },
    },
  },
  argTypes: {
    // ── Basic ────────────────────────────────────────────────────
    latitude: {
      description: "Initial map centre latitude. Required.",
      control: "number",
      table: {
        category: "Basic",
        type: { summary: "Number" },
        defaultValue: { summary: "51.507351" },
      },
    },
    longitude: {
      description: "Initial map centre longitude. Required.",
      control: "number",
      table: {
        category: "Basic",
        type: { summary: "Number" },
        defaultValue: { summary: "-0.127758" },
      },
    },
    zoom: {
      description: "Initial zoom level. Required.",
      control: "number",
      table: {
        category: "Basic",
        type: { summary: "Number" },
        defaultValue: { summary: "10" },
      },
    },
    minZoom: {
      description: "Minimum zoom level the user can zoom out to.",
      control: "number",
      table: {
        category: "Basic",
        type: { summary: "Number" },
        defaultValue: { summary: "7" },
      },
    },
    maxZoom: {
      description: "Maximum zoom level the user can zoom in to.",
      control: "number",
      table: {
        category: "Basic",
        type: { summary: "Number" },
        defaultValue: { summary: "22" },
      },
    },
    projection: {
      description:
        "Coordinate reference system for the latitude/longitude properties.",
      control: { type: "select" },
      options: ["EPSG:4326", "EPSG:27700", "EPSG:3857"],
      table: {
        category: "Basic",
        type: { summary: "String" },
        defaultValue: { summary: '"EPSG:4326"' },
      },
    },
    staticMode: {
      description: "Disables all user interactions (pan, zoom, etc.).",
      control: "boolean",
      table: {
        category: "Basic",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    hideResetControl: {
      description: "Hides the reset/re-centre control button.",
      control: "boolean",
      table: {
        category: "Basic",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    showScale: {
      description: "Shows a scale bar on the map.",
      control: "boolean",
      table: {
        category: "Basic",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    useScaleBarStyle: {
      description:
        'Switches the scale bar to a "bar" style instead of the default line style.',
      control: "boolean",
      table: {
        category: "Basic",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    id: {
      description: "id attribute for the map container element.",
      control: "text",
      table: {
        category: "Basic",
        type: { summary: "String" },
        defaultValue: { summary: '"map"' },
      },
    },
    ariaLabelOlFixedOverlay: {
      description: "ARIA label for the OpenLayers interactive overlay.",
      control: "text",
      table: {
        category: "Basic",
        type: { summary: "String" },
        defaultValue: { summary: '"An interactive map"' },
      },
    },
    // ── Basemap / API ────────────────────────────────────────────
    osVectorTilesApiKey: {
      description:
        "Ordnance Survey Vector Tiles API key. Falls back to OpenStreetMap if omitted. Obtain a key at https://osdatahub.os.uk/plans",
      control: "text",
      table: {
        category: "Basemap / API",
        type: { summary: "String" },
      },
    },
    disableVectorTiles: {
      description:
        "Forces the raster (Maps API) basemap instead of vector tiles.",
      control: "boolean",
      table: {
        category: "Basemap / API",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    osCopyright: {
      description: "Copyright notice displayed on the map.",
      control: "text",
      table: {
        category: "Basemap / API",
        type: { summary: "String" },
      },
    },
    osProxyEndpoint: {
      description:
        "Proxy endpoint for all OS API requests. The proxy must append a valid API key. See docs/how-to-use-a-proxy.md.",
      control: "text",
      table: {
        category: "Basemap / API",
        type: { summary: "String" },
        defaultValue: {
          summary: '"https://api.editor.planx.dev/proxy/ordnance-survey"',
        },
      },
    },
    // ── Drawing ──────────────────────────────────────────────────
    drawMode: {
      description: "Enables the polygon drawing tool.",
      control: "boolean",
      table: {
        category: "Drawing",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    drawPointer: {
      description: "Cursor style while drawing.",
      control: { type: "select" },
      options: ["crosshair", "dot"],
      table: {
        category: "Drawing",
        type: { summary: '"crosshair" | "dot"' },
        defaultValue: { summary: '"crosshair"' },
      },
    },
    drawGeojsonData: {
      description:
        "Initial GeoJSON Feature to load onto the drawing canvas. The user can continue modifying it.",
      table: {
        category: "Drawing",
        type: { summary: "GeoJSON Feature" },
        defaultValue: { summary: '{ type: "Feature", geometry: {} }' },
      },
    },
    drawGeojsonBuffer: {
      description: "Padding (in metres) around the initial draw shape.",
      control: "number",
      table: {
        category: "Drawing",
        type: { summary: "Number" },
        defaultValue: { summary: "100" },
      },
    },
    drawColor: {
      description: "Stroke colour of the drawn polygon.",
      control: "color",
      table: {
        category: "Drawing",
        type: { summary: "String" },
        defaultValue: { summary: '"#ff0000"' },
      },
    },
    drawFillColor: {
      description: "Fill colour of the drawn polygon.",
      table: {
        category: "Drawing",
        type: { summary: "String" },
        defaultValue: { summary: '"rgba(255, 0, 0, 0.1)"' },
      },
    },
    areaUnits: {
      description: "Unit for the area value emitted by `areaChange`.",
      control: { type: "select" },
      options: ["m2", "ha"],
      table: {
        category: "Drawing",
        type: { summary: '"m2" | "ha"' },
        defaultValue: { summary: '"m2"' },
      },
    },
    // ── GeoJSON ──────────────────────────────────────────────────
    geojsonData: {
      description:
        "Static GeoJSON FeatureCollection or Feature to display. The map view centres on the shape.",
      table: {
        category: "GeoJSON",
        type: { summary: "GeoJSON FeatureCollection | Feature" },
        defaultValue: {
          summary: '{ type: "FeatureCollection", features: [] }',
        },
      },
    },
    geojsonColor: {
      description: "Stroke colour for the displayed GeoJSON shape.",
      control: "color",
      table: {
        category: "GeoJSON",
        type: { summary: "String" },
        defaultValue: { summary: '"#ff0000"' },
      },
    },
    geojsonFill: {
      description: "Whether to fill the displayed GeoJSON polygon.",
      control: "boolean",
      table: {
        category: "GeoJSON",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    geojsonBuffer: {
      description: "Padding (in map units) around the GeoJSON shape.",
      control: "number",
      table: {
        category: "GeoJSON",
        type: { summary: "Number" },
        defaultValue: { summary: "12" },
      },
    },
    // ── Features ─────────────────────────────────────────────────
    showFeaturesAtPoint: {
      description:
        "Queries the OS Features API and highlights features at the map centre point.",
      control: "boolean",
      table: {
        category: "Features",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    clickFeatures: {
      description:
        "Allows clicking additional features to select/deselect them and build a merged site boundary.",
      control: "boolean",
      table: {
        category: "Features",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    featureColor: {
      description: "Stroke colour for highlighted OS features.",
      control: "color",
      table: {
        category: "Features",
        type: { summary: "String" },
      },
    },
    featureFill: {
      description: "Whether to fill highlighted OS features.",
      control: "boolean",
      table: {
        category: "Features",
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    featureBuffer: {
      description: "Buffer distance (in metres) around the query point.",
      control: "number",
      table: {
        category: "Features",
        type: { summary: "Number" },
        defaultValue: { summary: "40" },
      },
    },
    osFeaturesApiKey: {
      description:
        "Ordnance Survey Features API key. Obtain a key at https://osdatahub.os.uk/plans",
      control: "text",
      table: {
        category: "Features",
        type: { summary: "String" },
      },
    },
    // ── Events ───────────────────────────────────────────────────
    geojsonChange: {
      description:
        "Dispatched when the drawn polygon is closed or modified. `detail` is the GeoJSON representation of the shape.",
      table: {
        category: "Events",
        type: { summary: "CustomEvent" },
      },
    },
    areaChange: {
      description:
        "Dispatched when the drawn polygon is closed or modified. `detail` is the area in the units specified by `areaUnits`.",
      table: {
        category: "Events",
        type: { summary: "CustomEvent" },
      },
    },
    featurePick: {
      description:
        "Dispatched when the user clicks a feature in `clickFeatures` mode. `detail` contains the OS feature record.",
      table: {
        category: "Events",
        type: { summary: "CustomEvent" },
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// Basic
// ---------------------------------------------------------------------------

/**
 * Requires access to the Ordnance Survey Vector Tiles API.
 * Falls back to an OpenStreetMap basemap if no key is provided.
 */
export const OsVectorTiles: Story = {
  name: "Basic: OS vector tiles basemap",
  render: () => `<my-map zoom="18" osVectorTilesApiKey="${osApiKey}"</my-map>`,
};

/**
 * Requires access to the Ordnance Survey Maps API.
 * Falls back to an OpenStreetMap basemap if no key is provided.
 */
export const OsRasterTiles: Story = {
  name: "Basic: OS raster tiles basemap",
  render: () =>
    `<my-map zoom="18" osVectorTilesApiKey="" disableVectorTiles></my-map>`,
};

/**
 * Disable zooming, panning, and other map interactions.
 * Hide the reset control button.
 */
export const StaticMap: Story = {
  name: "Basic: static map",
  render: () =>
    `<my-map zoom="20" staticMode hideResetControl osVectorTilesApiKey="${osApiKey}"</my-map>`,
};

/**
 * Display a scale bar on the map for orientation.
 * Demonstrates both the default and "bar" styles offered by OpenLayers.
 */
export const ScaleBar: Story = {
  name: "Basic: scale bar",
  render: () =>
    `<my-map zoom="20" showScale useScaleBarStyle osVectorTilesApiKey="${osApiKey}"</my-map>`,
};

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

/**
 * Draw and modify a site plan boundary with a red line.
 * Starts at zoom 20 so snapping points are visible on initial load.
 */
export const DrawMode: Story = {
  name: "Drawing: draw mode",
  render: () => `
    <my-map
      id="draw-mode"
      zoom="20"
      maxZoom="23"
      drawMode
      drawPointer="dot"
      osVectorTilesApiKey="${osApiKey}"
    </my-map>`,
};

/**
 * Load a polygon onto the drawing canvas with the ability to continue
 * modifying it. Click 'reset' to erase and draw fresh.
 */
export const DrawModeWithInitialShape: Story = {
  name: "Drawing: load initial shape",
  render: () => `
    <my-map
      id="draw-mode-1"
      zoom="20"
      maxZoom="23"
      drawMode
      drawPointer="dot"
      osVectorTilesApiKey=""
      drawGeojsonData='${JSON.stringify({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-0.07666435775970835, 51.48432362355473],
              [-0.07670012065571297, 51.48419742371502],
              [-0.07630374962243747, 51.484158450222964],
              [-0.07627692753228853, 51.484288361835524],
              [-0.07666435775970835, 51.48432362355473],
            ],
          ],
        },
      })}'>
    </my-map>`,
};

/**
 * Listen for an `areaChange` event when the drawn polygon is closed or
 * modified. Area is returned in hectares — change `areaUnits` to `m2` for
 * square metres.
 */
export const DrawModeAreaCalculation: Story = {
  name: "Drawing: calculate area",
  render: () => `
    <my-map
      id="draw-mode-2"
      zoom="19"
      maxZoom="23"
      drawMode
      areaUnits="ha"
      osVectorTilesApiKey="${osApiKey}"
    </my-map>`,
  play: async ({ canvasElement }) => {
    const map = canvasElement.querySelector("my-map");
    map?.addEventListener("areaChange", ({ detail: area }: CustomEvent) => {
      console.debug({ area });
    });
  },
};

/**
 * Listen for a `geojsonChange` event when the drawn polygon is closed or
 * modified. Returns the GeoJSON representation of the drawn shape.
 */
export const DrawModeGeoJSONOutput: Story = {
  name: "Drawing: get GeoJSON output",
  render: () => `
    <my-map
      id="draw-mode-3"
      zoom="19"
      maxZoom="23"
      drawMode
      osVectorTilesApiKey="${osApiKey}"
    </my-map>`,
  play: async ({ canvasElement }) => {
    const map = canvasElement.querySelector("my-map");
    map?.addEventListener(
      "geojsonChange",
      ({ detail: geojson }: CustomEvent) => {
        console.debug({ geojson });
      },
    );
  },
};

// ---------------------------------------------------------------------------
// GeoJSON
// ---------------------------------------------------------------------------

/**
 * Display a static GeoJSON polygon on an OS basemap.
 * The map view centres on the shape, overriding latitude/longitude/zoom.
 * Zoom and reset controls are hidden.
 */
export const GeoJSONPolygon: Story = {
  name: "GeoJSON: show polygon on static map",
  render: () => `
    <my-map
      geojsonColor="#ff0000"
      geojsonBuffer="10"
      hideResetControl
      staticMode
      osVectorTilesApiKey=""
      geojsonData='${JSON.stringify({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-0.11562466621398924, 51.50746034612789],
              [-0.11449813842773436, 51.50617151942102],
              [-0.11359691619873047, 51.50653212745768],
              [-0.11348962783813477, 51.50645199258505],
              [-0.1127493381500244, 51.50665900738443],
              [-0.11383295059204103, 51.507907754128546],
              [-0.11562466621398924, 51.50746034612789],
            ],
          ],
        },
      })}'>
    </my-map>`,
};

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

/**
 * Shows the Ordnance Survey Feature(s) that intersect with a given point.
 * Requires access to the OS Features API and OS Vector Tiles API.
 */
export const ShowFeaturesAtPoint: Story = {
  name: "Features: show features at point",
  render: () => `
    <my-map
      showFeaturesAtPoint
      latitude="51.4858363"
      longitude="-0.0761246"
      featureColor="#8a2be2"
      osFeaturesApiKey="${osApiKey}"
      osVectorTilesApiKey="${osApiKey}"
    </my-map>`,
};

/**
 * Show features at point, plus the ability to click to select or deselect
 * additional features to build a more accurate full site boundary.
 */
export const ClickToSelectFeatures: Story = {
  name: "Features: click to select and merge",
  render: () => `
    <my-map
      showFeaturesAtPoint
      clickFeatures
      latitude="51.4854329"
      longitude="-0.0761992"
      featureColor="Magenta"
      osFeaturesApiKey="${osApiKey}"
      osVectorTilesApiKey="${osApiKey}"
    </my-map>`,
};

// ---------------------------------------------------------------------------
// Proxy
// ---------------------------------------------------------------------------

/**
 * Calls the Ordnance Survey Vector Tiles API via the supplied proxy endpoint.
 * The proxy must append a valid Ordnance Survey API key to each request.
 */
export const ProxiedVectorTiles: Story = {
  name: "Proxy: OS vector tiles",
  render: () =>
    `<my-map zoom="18" osProxyEndpoint="https://api.editor.planx.dev/proxy/ordnance-survey"></my-map>`,
};

/**
 * Calls the Ordnance Survey Maps API via the supplied proxy endpoint.
 * The proxy must append a valid Ordnance Survey API key to each request.
 */
export const ProxiedRasterTiles: Story = {
  name: "Proxy: OS raster tiles",
  render: () =>
    `<my-map zoom="18" osVectorTilesApiKey="" disableVectorTiles osProxyEndpoint="https://api.editor.planx.dev/proxy/ordnance-survey"></my-map>`,
};
