# Place components

[![npm @opensystemslab/map](https://img.shields.io/npm/v/@opensystemslab/map?style=flat-square)](http://npm.im/@opensystemslab/map)

A library of [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) for tasks related to addresses and planning permission in the UK built with [Lit](https://lit.dev/), [Vite](https://vitejs.dev/), and [Ordnance Survey APIs](https://developer.ordnancesurvey.co.uk/).

***Web map***

`<my-map />` is an [OpenLayers](https://openlayers.org/)-powered map to support drawing and modifying red-line boundaries. Other supported modes include: highlighting an OS Feature that intersects with a given address point; clicking to select and merge multiple OS Features into a single boundary; and displaying static point or polygon data. Events are dispatched with the calculated area and geojson representation when you change your drawing.

![chrome-capture-2022-7-16-map](https://user-images.githubusercontent.com/5132349/184860750-bf7514db-7cab-4f9c-aa32-791099ecd6cc.gif)

***Postcode search***

`<postcode-search />` is a [GOV.UK-styled](https://frontend.design-system.service.gov.uk/) input that validates UK postcodes using these [utility methods](https://www.npmjs.com/package/postcode). When a postcode is validated, an event is dispatched containing the sanitized string.

***Address autocomplete***

`<address-autocomplete />` fetches addresses in a given UK postcode using the [OS Places API](https://developer.ordnancesurvey.co.uk/os-places-api) and displays them using GOV.UK's [accessible-autocomplete](https://github.com/alphagov/accessible-autocomplete) component. An event is dispatched with the OS record when you select an address.

These web components can be used independently or together following GOV.UK's [Address lookup](https://design-system.service.gov.uk/patterns/addresses/) design pattern.

![chrome-capture-2022-7-16 (1)](https://user-images.githubusercontent.com/5132349/184858819-133bc7fa-7f48-4a2a-a416-b612febcce58.gif)

## Documentation & examples

- Interactive web component docs [oslmap.netlify.app](https://oslmap.netlify.app)
- [CodeSandbox](https://codesandbox.io/s/confident-benz-rr0s9?file=/index.html) (note: update the CDN script with a version number for new features)

Find these components in the wild, including what we're learning through public beta user-testing, at [https://www.ripa.digital/](https://www.ripa.digital/).

## Bring your own API keys

Different features rely on different APIs - namely from Ordnance Survey and Mapbox. 

You can set keys directly as props (eg `osApiKey`) on the applicable web components or [use a proxy](https://github.com/theopensystemslab/map/blob/main/docs/how-to-use-a-proxy.md) to mask these secrets. 

Address autocomplete utilises the OS Places API.

For the map:
- The `basemap` prop defaults to `"OSVectorTile"` which requires the OS Vector Tiles API
  - Basemap `"OSRaster"` uses the OS Maps API
  - Basemap `"MapboxSatellite"` requires a Mapbox Access Token with with scope `style:read`
  - The `"OSM"` (OpenStreetMap) basemap is available for users without any keys, and as a fallback if any of the above basemaps fail to build
- `clickFeatures` requires the OS Features API

When using Ordnance Survey APIs:
- Update the `osCopyright` attribution prop with your license number
- Configure an optional `osProxyEndpoint` to avoid exposing your keys (set this instead of `osApiKey`)
  - ** We are not currently supporting a similar proxy for Mapbox because access tokens can be restricted to specific URLs via your account

## Running locally

- Rename `.env.example` to `.env.local` and replace the values - or simply provide your API keys as props
- Install [pnpm](https://pnpm.io) globally if you don't have it already `npm i pnpm -g`
- Install dependencies `pnpm i`
- Start development server `pnpm dev`

### Tests

Unit tests are written with [Vitest](https://vitest.dev/), [Happy Dom](https://www.npmjs.com/package/happy-dom), and [@testing-library/user-event](https://testing-library.com/docs/user-event/intro/). Each component has a `main.test.ts` file.

- `pnpm test` starts `vitest` in watch mode
- `pnpm test:ui` opens Vitest's UI in the browser to interactively explore logs https://vitest.dev/guide/ui.html

### Docs

We use [Pitsby](https://pitsby.com/) for documenting our web components. It's simple to configure (`pitsby.config.js` plus a `*.doc.js` per component), has good support for vanilla web components, and an interactive playground.

- `pnpm run docs` starts Pitsby in watch mode for local development
- `pnpm run docsPublish` builds the site so Netlify can serve it from `pitsby/`

### Deployments

We publish this package via [NPM](https://www.npmjs.com/package/@opensystemslab/map).

To create a new release:
1. Open a new PR against `main` which bumps the package.json "version" & creates a CHANGELOG.md entry, request code review & merge on approval
1. Run `npm publish` or `npm publish --tag next` if making a pre-release (requires permissions to OSL team in NPM & access to 2-factor auth method)
1. [Draft a new release](https://github.com/theopensystemslab/map/releases) via GitHub web: tag should match version, automatically generate changenotes and link above PR, then "Publish" and set as latest version (or set as pre-release if you used `--tag next` in above command)

## License

This repository is licensed under the [Open Government License v3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
