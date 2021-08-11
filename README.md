# Map

[![npm @opensystemslab/map](https://img.shields.io/npm/v/@opensystemslab/map?style=flat-square)](http://npm.im/@opensystemslab/map)

An [OpenLayers](https://openlayers.org/)-powered [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) map for tasks related to planning permission in the UK.

![anim](https://user-images.githubusercontent.com/601961/128994212-11ffa793-5db4-4cac-a616-a2f949fe9360.gif)

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

`geojsonColor` & `geojsonBuffer` are optional style properties. Color sets the stroke of the displayed data and buffer is used to fit the map view to the extent of the geojson features. `geojsonBuffer` corresponds to "value" param in OL documentation [here](https://openlayers.org/en/latest/apidoc/module-ol_extent.html).

### Example: highlight features that intersect with a given coordinate

Requires access to the Ordnance Survey Features API. Sign up for a key here: https://osdatahub.os.uk/plans. 

Relevant configurable properties & their default values: 
```js
@property({ type: Number })
latitude = 51.507351;

@property({ type: Number })
longitude = -0.127758;

@property({ type: Boolean })
showFeaturesAtPoint = false;

@property({ type: String })
featureColor = "#0000ff";

@property({ type: Number })
featureBuffer = 40;
```

Set `showFeaturesAtPoint` to true. `latitude` and `longitude` are required and used to query the OS Features API for features that contain this point.

`featureColor` & `featureBuffer` are optional style properties. Color sets the stroke of the displayed data and buffer is used to fit the map view to the extent of the features. `featureBuffer` corresponds to "value" param in OL documentation [here](https://openlayers.org/en/latest/apidoc/module-ol_extent.html).

```html
<my-map latitude="51.4858363" longitude="-0.0761246" showFeaturesAtPoint featureColor="#8a2be2" />
```

## Running Locally

- Rename `.env.example` to `.env.local` and replace the values
- Install dependencies `pnpm i`
- Start dev server `pnpm dev`
- Open http://localhost:3000

## License

This repository is licensed under the [Open Government License v3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
