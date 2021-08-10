# Map

[![npm @opensystemslab/map](https://img.shields.io/npm/v/@opensystemslab/map?style=flat-square)](http://npm.im/@opensystemslab/map)

An OpenLayers-powered Web Component map for tasks related to planning permission in the UK.

## Demo

[CodeSandbox](https://codesandbox.io/s/confident-benz-rr0s9?file=/index.html)

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
