# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Note:** Version 0 of Semantic Versioning is handled differently from version 1 and above.
The minor version will be incremented upon a breaking change and the patch version will be
incremented for features.

### [0.8.3] - 2024-06-28

### Fixed
- fix(a11y): adds a `role` to the map container div of either `application` if interactive or `presentation` if implemented in static mode ([#454](https://github.com/theopensystemslab/map/pull/454))

### Changed
- deps: various dependency updates via Dependabot

### [0.8.2] - 2024-05-09

### Added 
- feat(a11y): adds optional prop `ariaLabelOlFixedOverlay` which sets an `aria-label` on the outermost `canvas` element rendered in the shadow root ([#445](https://github.com/theopensystemslab/map/pull/445))
- fix(a11y): sets `aria-controls` on the OL Attribution control button rendered when `collapseAttributions` is true, and a corresponding `id` on the attribution list ([#446](https://github.com/theopensystemslab/map/pull/446))

### [0.8.1] - 2024-04-05

### Changed
- fix: usability improvements such as stronger focus color contrast and improved keyboard navigation based on recent accessibility audit ([#442](https://github.com/theopensystemslab/map/pull/442))
- deps: upgraded to Vite v5, in addition to a number of other Dependabot updates ([#441](https://github.com/theopensystemslab/map/pull/441))

### [0.8.0] - 2024-01-25

### Breaking
- feat: adds new boolean prop `showGeojsonDataMarkers` to display point features passed via the `geojsonData` prop; renames existing `showMarker` boolean prop to `showCentreMarker` for clarity ([#429](https://github.com/theopensystemslab/map/pull/429))

### [0.7.9] - 2024-01-02

### Added
- feat: new props `drawGeojsonDataCopyright`, `geojsonDataCopyright`, and `collapseAttributes` allow multiple attributions to be set and styled on the map ([#424](https://github.com/theopensystemslab/map/pull/424))

### Changed
- deps: various dependency updates via Dependabot

### [0.7.8] - 2023-12-13

### Changed
- fix: now displays vertices for polygons as well as multipolygons that are passed into `drawGeojsonData` prop ([#417](https://github.com/theopensystemslab/map/pull/417))

### [0.7.7] - 2023-09-01

### Added
- feat: ability to set a custom border color _per_ feature when passing a `FeatureCollection` into `geojsonData` by reading from the feature's `properties.color` attribute. If `properties.color` is not defined, `geojsonColor` will be used to style each feature. ([#381](https://github.com/theopensystemslab/map/pull/381))

### [0.7.6] - 2023-08-30

### Added
- feat: add `drawColor` & `drawFillColor` props to customise the drawing color. It still defaults to red for the canonical example of location plans. ([#379](https://github.com/theopensystemslab/map/pull/379))

### [0.7.5] - 2023-08-14

### Added
- feat: add `clipGeojsonData` prop to disable panning/zooming/navigating the map's viewport beyond a given geojson extent. ([#363](https://github.com/theopensystemslab/map/pull/363))

### Changed
- deps: various dependency updates via Dependabot

### [0.7.4] - 2023-03-17

### Changed
- fix: ensure autocomplete selected address formatting always matches option, completing #275 below. ([#277](https://github.com/theopensystemslab/map/pull/277))

### [0.7.3] - 2023-03-17

### Changed
- fix: split single line addresses on last occurance of council name, not first, in address-autocomplete dropdown options. Our previous string formatting method failed on postcode ME7 1NH ([#275](https://github.com/theopensystemslab/map/pull/275))

### [0.7.2] - 2023-02-24

### Added
- feat: Printing ([#263](https://github.com/theopensystemslab/map/pull/263))

### Changed
- chore: Update `@testing-library/dom` and `vitest` dependencies to latests ([#265](https://github.com/theopensystemslab/map/pull/265))

### [0.7.1] - 2023-02-07

### Changed
- fix: correctly project coordinates to EPSG:27700 on GeoJSON change events (coordinates in EPSG:3857 are and were ok!) ([#261](https://github.com/theopensystemslab/map/pull/261))

### [0.7.0] - 2023-01-20

### Changed
- **BREAKING**: GeoJSON change events are now dispatched in _two_ projections: EPSG:3857 (prior default) and EPSG:27700. If you are subscribed to these events, please update your code to reflect the new data format ([#255](https://github.com/theopensystemslab/map/pull/255))
- fix: display scale bar correctly ([#252](https://github.com/theopensystemslab/map/pull/252))
- fix: debug `drawGeojsonData` examples in Pitsy Component Docs ([#249](https://github.com/theopensystemslab/map/pull/249))

### [0.6.3] - 2022-12-21

### Added 
- feat: add `osProxyEndpoint` prop to support optionally calling the Ordnance Survey APIs via a proxy in public applications to avoid exposing your API keys ([#241](https://github.com/theopensystemslab/map/pull/241))

### Changed
- build: update vitest dependencies

### [0.6.2] - 2022-12-09

### Added 
- feat: add `drawingType` prop to specify "Polygon" (default) or "Point" to enable drawing a single point ([#232](https://github.com/theopensystemslab/map/pull/232))

### Changed
- chore: update styling of default scale line ([#230](https://github.com/theopensystemslab/map/pull/230))
- chore: swap out north arrow icon and remove unused `resetControlImage` icons ([#233](https://github.com/theopensystemslab/map/pull/233))
- build: update vite and vitest-related dependencies

### [0.6.1] - 2022-10-17

### Added
- feat: `resetControlImage` prop can be used to specify a custom icon for the reset control button. This is likely a temporary prop while user research testing is conducted, then we will refactor to use a single standard icon ([#209](https://github.com/theopensystemslab/map/pull/209))

### [0.6.0] - 2022-10-10

### Added
- feat: `showNorthArrow` boolean prop will show a static North arrow icon in the upper right of the map for official reference ([#198]https://github.com/theopensystemslab/map/pull/198)

### [0.5.9] - 2022-08-26

### Changed
- fix: Ensure snap points load on the map's `loadend` event ([#193](https://github.com/theopensystemslab/map/pull/193))
- test: Added basic suite of OL tests for snap loading, exposing an `olMap` instance on the global window for testing

### [0.5.8] - 2022-08-19

### Added
- feat: Added map property `projection` to specify which system you are supplying coordinates in. Supported values are `EPSG:4326` (default), `EPSG:27700`, and `EPSG:3857` ([#168](https://github.com/theopensystemslab/map/pull/168))
- feat: Added Vitest framework for unit testing our web components and a Github Action workflow to run tests on all pull requests ([#139](https://github.com/theopensystemslab/map/pull/139), [#191](https://github.com/theopensystemslab/map/pull/191))
- feat: Added Pitsby interactive documentation for our web components, available at [oslmap.netlify.app](https://oslmap.netlify.app/) ([#61](https://github.com/theopensystemslab/map/pull/61))

### Changed
- docs: Updated README to reflect scope of all components and new local dev instructions ([#181](https://github.com/theopensystemslab/map/pull/181))
- build: Upgraded multiple project dependencies

### [0.5.7] - 2022-07-28

### Added
- feat: `markerImage` property added to specify a circle (default) or pin icon ([#165](https://github.com/theopensystemslab/map/pull/165))

### Changed
- build: Upgrade development dependency Vite to v3 ([#167](https://github.com/theopensystemslab/map/pull/167))

### [0.5.6] - 2022-07-05

### Added
- feat: `showMarker` property added to display a point on the map (defaults to latitude & longitude used to center the map, custom coordinates can be provided using `markerLatitude`, `markerLongitude`) ([#159](https://github.com/theopensystemslab/map/pull/159))

### Changed
- fix: Ability to remove border style using boolean property `featureBorderNone` when in `showFeaturesAtPoint` mode ([#159](https://github.com/theopensystemslab/map/pull/159))

### [0.5.5] - 2022-05-09

### Changed
- fix: Update map focus to Gov.UK yellow, adding a black border on map element for sufficient contrast ([#147](https://github.com/theopensystemslab/map/pull/147))

## [0.5.4] - 2022-03-29

### Changed
- fix: Ensure error container is always in DOM (autocomplete) ([#136](https://github.com/theopensystemslab/map/pull/136))

## [0.5.3] - 2022-03-28

### Changed
- fix: Re-enable `labelStyle` property ([#133](https://github.com/theopensystemslab/map/pull/133))

## [0.5.2] - 2022-03-28

### Added
- feat: `labelStyle` property added to autocomplete ([#130](https://github.com/theopensystemslab/map/pull/130))

### Changed
- fix: Accessibility fixes flagged by auditors ([#131](https://github.com/theopensystemslab/map/pull/131))

## [0.5.1] - 2022-03-24

### Added
- feat: `arrowStyle` property added to autocomplete ([#128](https://github.com/theopensystemslab/map/pull/128))

### Changed
- fix: Improve style of autocomplete ([#128](https://github.com/theopensystemslab/map/pull/128))

## [0.5.0] - 2022-03-23

### Changed
- fix: autocomplete shouldn't have a tabindex on its' container, only the input ([#126](https://github.com/theopensystemslab/map/pull/126))

## [0.4.9] - 2022-03-23

### Added
- feat: allow autocomplete to be styled from the parent ([#124](https://github.com/theopensystemslab/map/pull/124))

### Changed
- fix: autocomplete & search should set `tabindex="0"` to ensure they're keyboard accessible ([#122](https://github.com/theopensystemslab/map/pull/122))

## [0.4.8] - 2022-03-22

### Added
- feat: address-autocomplete supports a default value using the `initialAddress` property ([#120](https://github.com/theopensystemslab/map/pull/120))

## [0.4.7] - 2022-03-22

### Added
- feat: two new components ([#93](https://github.com/theopensystemslab/map/pull/93))! file structure & build config are adjusted to reflect a library of components, but no breaking changes to the original map. New components:
1. `<postcode-search />` is a GOV.UK-styled input that validates UK postcodes using [these utility methods](https://www.npmjs.com/package/postcode). When a postcode is validated, an event is dispatched containing the sanitized string.
2. `<address-autocomplete />` fetches addresses in a given UK postcode using the [OS Places API](https://developer.ordnancesurvey.co.uk/os-places-api) and displays them using GOV.UK's [accessible-autocomplete](https://github.com/alphagov/accessible-autocomplete) component. When you select an address, an event is dispatched with the full OS record for that address. Set the `osPlacesApiKey` property to start using this component.

## [0.4.6] - 2022-02-04

### Changed
- fix: make snap points visible on the first render before any interactions if other conditions are met (`drawMode` is enabled, `zoom` is greater than or equal to 20). Previosly, we'd only render snaps after a map move ([#112](https://github.com/theopensystemslab/map/pull/112))

## [0.4.5] - 2022-01-14

### Added
- feat: string property `id` now allows users to set a custom id on the custom element `<my-map />`. it still defaults to `id="map"` as before ([#110](https://github.com/theopensystemslab/map/pull/110))

### Changed
- fix: `featureSource` and `drawingSource` are now cleared upfront when their respective interaction modes (eg `showFeaturesAtPoint`, `drawMode`) are enabled. This doesn't change anything on the first map render, but should help clear up scenarios where the map has been redrawn with new props but the layer still holds prior data features ([#110](https://github.com/theopensystemslab/map/pull/110))

## [0.4.4] - 2022-01-11

### Changed
- fix: when in `drawMode`, "reset" control button now dispatches two events to reset area to 0 and empty geojson. Previously, the area and geojson continued to reflect the last drawn polygon ([#102](https://github.com/theopensystemslab/map/pull/102))
- bump rambda and @types/node dependencies ([#107](https://github.com/theopensystemslab/map/pull/107) & [#108](https://github.com/theopensystemslab/map/pull/108))

## [0.4.3] - 2021-12-14

### Changed
- fix: control buttons are an accessible size ([#95](https://github.com/theopensystemslab/map/pull/95))
- fix: add Lit lifecycle method to unmount map ([#97](https://github.com/theopensystemslab/map/pull/97))

## [0.4.2] - 2021-11-26

### Changed
- upgrade openlayers ([#89](https://github.com/theopensystemslab/map/pull/89))

## [0.4.1] - 2021-11-25

### Changed
- feat: string property `osCopyright` now allows users to set the map attribution for OS layers based on their own API keys. The default copyright text is updated to reflect our new data agreement with DHLUC ([#88](https://github.com/theopensystemslab/map/pull/88))

## [0.4.0] - 2021-11-24

### Changed
- **BREAKING**: removed `ariaLabel` property based on accessibility audit recommendation, as aria-label attributes shouldn't be used on div elements ([#86](https://github.com/theopensystemslab/map/pull/86))

## [0.3.7] - 2021-11-19

### Added
- feat: string property `drawPointer` to set the drawing cursor style, defaults to "crosshair" or can be set to "dot" ([#84](https://github.com/theopensystemslab/map/pull/84))

### Changed
- fix: keep snapping behavior while modifying drawn polygon ([#83](https://github.com/theopensystemslab/map/pull/83))

## [0.3.6] - 2021-11-12

### Added
- feat: `drawMode` now derives snap-able points from the OS Vector Tiles basemap and displays them by default when the zoom level > 20. The drawing pointer also changed from a red dot to a simple crosshair. ([#75](https://github.com/theopensystemslab/map/pull/75))

### Changed
- fix: updated control button color for more accessible level of contrast ([#77](https://github.com/theopensystemslab/map/pull/77))
- fix: ensure prettier is run on precommit hook ([#78](https://github.com/theopensystemslab/map/pull/78))
- fix: typo in Readme ([#73](https://github.com/theopensystemslab/map/pull/73))

## [0.3.5] - 2021-10-27

### Added
- feat: ability to display a geojson polygon in the initial drawing layer when in `drawMode`, using new object property `drawGeojsonData` and number property `drawGeojsonBuffer` ([#70](https://github.com/theopensystemslab/map/pull/70))
- feat: dispatch events `featuresAreaChange`, `featuresGeojsonChange` and `geojsonDataArea`, so that show/click features mode and loading static data has parity with existing event dispatching used in draw mode ([#69](https://github.com/theopensystemslab/map/pull/69))

## [0.3.4] - 2021-10-01

### Added
- feat: boolean property `featureFill` to style the fill color of OS Features polygon as the specified stroke color with 20% opacity, disabled/false by default. Same idea as below, my oversight for not combining them into the same release! ([#66](https://github.com/theopensystemslab/map/pull/66))

## [0.3.3] - 2021-10-01

### Added
- feat: boolean property `geojsonFill` to style the fill color of a static geojson polygon as the specified stroke color with 20% opacity, disabled/false by default ([#64](https://github.com/theopensystemslab/map/pull/64))

## [0.3.2] - 2021-09-22

### Added
- feat: show vertices of the drawn polygon, similar in design to MapInfo Professional which will hopefully help guide users in modifying existing vertices or adding new ones when drawing a site boundary ([#57](https://github.com/theopensystemslab/map/pull/57))
- feat: accessibilty improvements, including string property `ariaLabel` to add custom text to describe the component and the ability to access the main map div and control buttons by tabbing ([#58](https://github.com/theopensystemslab/map/pull/58))
- feat: boolean properties `showScale` and `useScaleBarStyle` to display a scale bar on the map ([#60](https://github.com/theopensystemslab/map/pull/60))

## [0.3.1] - 2021-08-27

### Changed
- fix: any prior drawings are cleared upon enabling `drawMode`, resolving an edge case that could occur in PlanX 'back' button behavior ([#50](https://github.com/theopensystemslab/map/pull/50))

### Added
- feat: string property `areaUnit` to specify "m2" for metres squared (default) or "ha" for hectares when returning the total area of a feature ([#51](https://github.com/theopensystemslab/map/pull/51))
- feat: boolean property `clickFeatures` to extend the `showFeaturesAtPoint` mode, by allowing a user to click to select or de-select features ([#48](https://github.com/theopensystemslab/map/pull/48))

## [0.3.0] - 2021-08-17

### Changed
- **BREAKING**: `renderVectorTiles` is renamed to `disableVectorTiles` and disabled by default, a convention we'll follow for all boolean property types going forward ([#40](https://github.com/theopensystemslab/map/pull/40))
- fix: reset control erases drawing when `geojsonData` is also displayed ([#42](https://github.com/theopensystemslab/map/pull/42))
- fix: total area doesn't return html tags if units are configured to square metres ([#43](https://github.com/theopensystemslab/map/pull/43))

### Added
- feat: boolean properties `hideResetControl` and `staticMode` to configure visibility of control buttons and allowed user interactions like zooming/dragging ([#41](https://github.com/theopensystemslab/map/pull/41))

## [0.2.0] - 2021-08-12

### Changed
- **BREAKING**: Ordnance Survey API keys are now provided client-side as optional properties `osVectorTilesApiKey`, `osFeaturesApiKey` ([#29](https://github.com/theopensystemslab/map/pull/29))
- fix: `geojsonData` now handles `{ "type": "Feature" }` in addition to "FeatureCollection" ([#34](https://github.com/theopensystemslab/map/pull/34))

### Added 
- docs: basic examples + gif ([#33](https://github.com/theopensystemslab/map/pull/33), [#35](https://github.com/theopensystemslab/map/pull/35))

## [0.1.0] - 2021-08-10

### Changed

- **BREAKING**: [`drawMode` is now disabled by default](https://github.com/theopensystemslab/map/pull/24#discussion_r685808355)
- upgrade from lit-element > lit ([#27](https://github.com/theopensystemslab/map/pull/27))

### Added

- feat: query & display features that intersect with lon,lat ([#24](https://github.com/theopensystemslab/map/pull/24))
- feat: display a static polygon if geojson provided ([#19](https://github.com/theopensystemslab/map/pull/19))
- docs: ([update npm badge link](https://github.com/theopensystemslab/map/commit/5e95993869bc6bd04761fdfb02a7e208e82aade6))
