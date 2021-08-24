# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Note:** Version 0 of Semantic Versioning is handled differently from version 1 and above.
The minor version will be incremented upon a breaking change and the patch version will be
incremented for features.

## [0.4.0] - 2021-08-25

### Changed
- fix: any prior drawings are properly cleared before entering `drawMode` ([#50](https://github.com/theopensystemslab/map/pull/50))

### Added
- feat: string property `areaUnits` to specify "m2" for metres squared (default) or "ha" for hectares when returning the total area of a feature ([#51](https://github.com/theopensystemslab/map/pull/51))
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
