# Map

[![npm @opensystemslab/map](https://img.shields.io/npm/v/@opensystemslab/map?style=flat-square)](http://npm.im/@opensystemslab/map)

An [OpenLayers](https://openlayers.org/)-powered [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) map for tasks related to planning permission in the UK.

![anim](https://user-images.githubusercontent.com/601961/128994212-11ffa793-5db4-4cac-a616-a2f949fe9360.gif)

## Demo

[CodeSandbox](https://codesandbox.io/s/confident-benz-rr0s9?file=/index.html)

#### Example: render the Ordnance Survey vector tile basemap

```html
<my-map osVectorTilesApiKey="secret" />
```

Requires access to the Ordnance Survey Vector Tiles API. Sign up for a key here https://osdatahub.os.uk/plans.

Available properties & their default values:
```js
@property({ type: Boolean })
disableVectorTiles = false;

@property({ type: String })
osVectorTilesApiKey = "";
```

We want to use the most detailed base map possible, so `disableVectorTiles` is false by default. If you configure it to true & you provide an API key, we'll render the OS raster base map. If there is no API key, regardless of the value of `disableVectorTiles`, we'll fallback to the OpenStreetMap tile server.

#### Example: load geojson on a static map

```html
<body>
  <my-map geojsonBuffer="10" hideResetControl staticMode />
  <script>
    const map = document.querySelector("my-map");
    map.geojsonData = { ... }
  </script>
</body>
```

Available properties & their default values:
```js
@property({ type: Object })
geojsonData = {
  type: "FeatureCollection",
  features: [],
};

@property({ type: String })
geojsonColor = "#ff0000";

@property({ type: Number })
geojsonBuffer = 15;

@property({ type: Boolean })
hideResetControl = false;

@property({ type: Boolean })
staticMode = false;
```

`geojsonData` is required, and should be of type "FeatureCollection" or "Feature". The default is an empty geojson object so that we can initialize a VectorLayer & VectorSource regardless. This is currently optimized for geojson containing a single polygon feature.

`geojsonColor` & `geojsonBuffer` are optional style properties. Color sets the stroke of the displayed data and buffer is used to fit the map view to the extent of the geojson features. `geojsonBuffer` corresponds to "value" param in OL documentation [here](https://openlayers.org/en/latest/apidoc/module-ol_extent.html#.buffer).

`hideResetControl` hides the `↻` button, which when clicked would re-center your map if you've zoomed or panned away from the default view. `staticMode` additionally hides the `+/-` buttons, and disables mouse and keyboard zoom and pan/drag interactions.

#### Example: draw a custom polygon & calculate its area

```html
<body>
  <my-map drawMode zoom="18" areaUnit="ha" />
  <script>
    const map = document.querySelector("my-map");
    map.addEventListener("areaChange", ({ detail: area }) => {
      console.debug({ area });
    });
  </script>
</body>
```

Available properties & their default values:
```js
@property({ type: Boolean })
drawMode = false;

@property({ type: Number })
latitude = 51.507351;

@property({ type: Number })
longitude = -0.127758;

@property({ type: Number })
zoom = 10;

@property({ type: String })
areaUnit = "m2"
```

Set `drawMode` to true. `latitude`, `longitude`, and `zoom` are used to set the initial map view. Drawing style is red by default, consistent with site plan standards in the UK.

We currently limit drawing to a single polygon. After you close your polygon, you can modify it by clicking on an edge and dragging. The `↻` button will clear your drawing and recenter the map. Add an optional event listener to calculate the total area of the drawing. `areaUnit` defaults to "m2" for square metres, but can also be configured to "ha" for hectares.

#### Example: highlight features that intersect with a given coordinate

```html
<my-map showFeaturesAtPoint osFeaturesApiKey="secret" latitude="51.4858363" longitude="-0.0761246" featureColor="#8a2be2" />
```

Requires access to the Ordnance Survey Features API. Sign up for a key here https://osdatahub.os.uk/plans. 

Available properties & their default values:
```js
@property({ type: Boolean })
showFeaturesAtPoint = false;

@property({ type: String })
osFeaturesApiKey = "";

@property({ type: Number })
latitude = 51.507351;

@property({ type: Number })
longitude = -0.127758;

@property({ type: String })
featureColor = "#0000ff";

@property({ type: Number })
featureBuffer = 40;
```

Set `showFeaturesAtPoint` to true. `osFeaturesApiKey`, `latitude`, and `longitude` are each required to query the OS Features API for features that contain this point.

`featureColor` & `featureBuffer` are optional style properties. Color sets the stroke of the displayed data and buffer is used to fit the map view to the extent of the features. `featureBuffer` corresponds to "value" param in OL documentation [here](https://openlayers.org/en/latest/apidoc/module-ol_extent.html#.buffer).

#### Example: click to expand or deselect the highlighted feature

Extends prior example by making the map interactive and listening for single click events. Currently only possible when `showFeaturesAtPoint` is also enabled.

```html
<my-map showFeaturesAtPoint clickFeatures ... />
```

Set `clickFeatures` to true, this will begin listening for single click events. New features will be highlighted or de-selected as you click. If the selected features share borders, the highlight border will appear as a merged single feature.

## Running Locally

- Rename `.env.example` to `.env.development.local` and replace the values - or simply provide your API keys as props
- Install [pnpm](https://pnpm.io) `npm i pnpm -g`
- Install dependencies `pnpm i`
- Start dev server `pnpm dev`

### Tests

Unit tests are written with [Vitest](https://vitest.dev/).

- `pnpm test` starts `vitest` in watch mode
- `pnpm test:ui` opens Vitest's UI in the browser where you can interact with your tests and explore logs https://vitest.dev/guide/ui.html

## License

This repository is licensed under the [Open Government License v3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
