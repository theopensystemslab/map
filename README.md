# Map

[![npm @opensystemslab/map](https://img.shields.io/npm/v/@opensystemslab/map?style=flat-square)](http://npm.im/@opensystemslab/map)

An OpenLayers-powered Web Component map for tasks related to planning permission in the UK.

## Demo

[CodeSandbox](https://codesandbox.io/s/confident-benz-rr0s9?file=/index.html)

### Example: load static geojson

Relevant configurable properties & their default values: 
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
```

`geojsonData` is required. The default is an empty geojson object so that we can initialize a VectorLayer & VectorSource regardless. This is currently optimized for geojson containing a single polygon feature.

`geojsonColor` & `geojsonBuffer` are optional style properties. Color sets the stroke of the displayed data and buffer is used to fit the map view to the extent of the geojson features. `geojsonBuffer` corresponds to "value" param in OL documentation (here)[https://openlayers.org/en/latest/apidoc/module-ol_extent.html].


## Running Locally

- Rename `.env.example` to `.env.local` and replace the values
- Install dependencies `pnpm i`
- Start dev server `pnpm dev`
- Open http://localhost:3000
