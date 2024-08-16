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

Address autocomplete utilises OS Places API.

For the map:
- We'll attempt to render the map using the OS Vector Tiles API
  - You can pass `disableVectorTiles` to render a raster basemap instead which uses the default OS Maps API
  - If you don't have an OS API key at all, it defaults to OpenStreetMap
- `clickFeatures` requires the OS Features API
- `applySatelliteStyle` requires a Mapbox Access Token with the scope `style:read`

When using Ordnance Survey APIs:
- Update the `osCopyright` attribution with your license number
- Configure `osProxyEndpoint` to avoid exposing your keys
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

## License

This repository is licensed under the [Open Government License v3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
