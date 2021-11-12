# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Note:** Version 0 of Semantic Versioning is handled differently from version 1 and above.
The minor version will be incremented upon a breaking change and the patch version will be
incremented for features.

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
