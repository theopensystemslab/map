# Place components

[![npm @opensystemslab/map](https://img.shields.io/npm/v/@opensystemslab/map?style=flat-square)](http://npm.im/@opensystemslab/map)

A library of [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) for tasks related to addresses and planning permission in the UK built with [Lit](https://lit.dev/), [Vite](https://vitejs.dev/), and [Ordnance Survey APIs](https://developer.ordnancesurvey.co.uk/).

***Web map***

`<my-map />` is an [OpenLayers](https://openlayers.org/)-powered map to support drawing and modifying red-line boundaries. Other supported modes include: highlighting an OS Feature that intersects with a given address point; clicking to select and merge multiple OS Features into a single boundary; and displaying static point or polygon data. Events are dispatched on change with the calculated area (m2 or hectares) and geojson representation of the drawn data.

![anim](https://user-images.githubusercontent.com/601961/128994212-11ffa793-5db4-4cac-a616-a2f949fe9360.gif)

***Postcode search***

`<postcode-search />` is a [GOV.UK-styled](https://frontend.design-system.service.gov.uk/) input that validates UK postcodes using these [utility methods](https://www.npmjs.com/package/postcode). When a postcode is validated, an event is dispatched containing the sanitized string.

***Address autocomplete***

`<address-autocomplete />` fetches addresses in a given UK postcode using the [OS Places API](https://developer.ordnancesurvey.co.uk/os-places-api) and displays them using GOV.UK's [accessible-autocomplete](https://github.com/alphagov/accessible-autocomplete) component. An event is dispatched with the OS record when you select an address.

These web components can be used independently or together following GOV.UK's [Address lookup](https://design-system.service.gov.uk/patterns/addresses/) design pattern.

## Documentation & examples

- Interactive web component docs [oslmap.netlify.app](https://oslmap.netlify.app)
- [CodeSandbox](https://codesandbox.io/s/confident-benz-rr0s9?file=/index.html) (note: update the CDN script with a version number for new features)

Find these components in the wild, including what we're learning through public beta user-testing, at [https://www.ripa.digital/](https://www.ripa.digital/).

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
