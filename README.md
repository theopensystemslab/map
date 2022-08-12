# Map

[![npm @opensystemslab/map](https://img.shields.io/npm/v/@opensystemslab/map?style=flat-square)](http://npm.im/@opensystemslab/map)

An [OpenLayers](https://openlayers.org/)-powered [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) map for tasks related to planning permission in the UK.

![anim](https://user-images.githubusercontent.com/601961/128994212-11ffa793-5db4-4cac-a616-a2f949fe9360.gif)

## Demo

- Interactive docs [oslmap.netlify.app](https://oslmap.netlify.app)
- [CodeSandbox](https://codesandbox.io/s/confident-benz-rr0s9?file=/index.html) (note: update the CDN script with a version number for new features)

## Running Locally

- Rename `.env.example` to `.env.development.local` and replace the values - or simply provide your API keys as props
- Install [pnpm](https://pnpm.io) `npm i pnpm -g`
- Install dependencies `pnpm i`
- Start dev server `pnpm dev`

### Tests

Unit tests are written with [Vitest](https://vitest.dev/).

- `pnpm test` starts `vitest` in watch mode
- `pnpm test:ui` opens Vitest's UI in the browser where you can interact with your tests and explore logs https://vitest.dev/guide/ui.html

### Docs

We use [Pitsby](https://pitsby.com/) for documenting our web components. It's simple to configure (`pitsby.config.js` plus a `*.doc.js` per component), has good support for vanilla web components, and an interactive playground.

- `pnpm run docs` starts Pitsby in watch mode for local development
- `pnpm run docsPublish` builds the site so Netlify can serve it from `./pitsby`

## License

This repository is licensed under the [Open Government License v3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
