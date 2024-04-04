import type { IWindow } from "happy-dom";
import { beforeEach, describe, it, expect, MockInstance } from "vitest";
import Map from "ol/Map";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import waitForExpect from "wait-for-expect";

import { getShadowRoot, setupMap } from "../../test-utils";
import * as snapping from "./snapping";
import "./index";

declare global {
  interface Window extends IWindow {}
}

test("olMap is added to the global window for tests", async () => {
  await setupMap(`<my-map id="map-vitest" disableVectorTiles />`);
  expect(window.olMap).toBeTruthy();
  expect(window.olMap).toBeInstanceOf(Map);
});

describe("MyMap on initial render with OSM basemap", async () => {
  beforeEach(
    () => setupMap('<my-map id="map-vitest" disableVectorTiles />'),
    2500,
  );

  it("should render a custom element with a shadow root", () => {
    const map = document.body.querySelector("my-map");
    expect(map).toBeTruthy;

    const mapShadowRoot = getShadowRoot("my-map");
    expect(mapShadowRoot).toBeTruthy;
  });
});

describe("Keyboard navigation of map container, controls and attribution links", () => {
  it("map container should be keyboard navigable by default", async () => {
    await setupMap(`<my-map id="map-vitest" disableVectorTiles />`);
    const map = getShadowRoot("my-map")?.getElementById("map-vitest");
    expect(map).toBeTruthy;
    expect(map?.getAttribute("tabindex")).toEqual("1");
  });

  it("should omit map container from tab order if not interactive", async () => {
    await setupMap(`<my-map id="map-vitest" disableVectorTiles staticMode />`);
    const map = getShadowRoot("my-map")?.getElementById("map-vitest");
    expect(map).toBeTruthy;
    expect(map?.getAttribute("tabindex")).toEqual("-1");
  });

  it("should keep map container in tab order if attributions are collapsed", async () => {
    await setupMap(
      `<my-map id="map-vitest" disableVectorTiles staticMode collapseAttributions />`,
    );
    const map = getShadowRoot("my-map")?.getElementById("map-vitest");
    expect(map).toBeTruthy;
    expect(map?.getAttribute("tabindex")).toEqual("1");
  });
});

describe("Snap points loading behaviour", () => {
  const ZOOM_WITHIN_RANGE = 25;
  const ZOOM_OUTWITH_RANGE = 15;

  const getSnapSpy: MockInstance = vi.spyOn(
    snapping,
    "getSnapPointsFromVectorTiles",
  );
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should not load snap points if the initial zoom is not within range", async () => {
    await setupMap(`<my-map 
      id="map-vitest" 
      zoom=${ZOOM_OUTWITH_RANGE} 
      drawMode 
      osVectorTileApiKey=${process.env.VITE_APP_OS_VECTOR_TILES_API_KEY}
    />`);
    const pointsLayer = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "pointsLayer");
    expect(pointsLayer).toBeDefined();
    const source = pointsLayer?.getSource() as VectorSource;
    expect(source.getFeatures()?.length).toEqual(0);
    expect(getSnapSpy).not.toHaveBeenCalled();
  });

  it("should load snap points if the initial zoom is within range", async () => {
    await setupMap(`<my-map 
      id="map-vitest" 
      zoom=${ZOOM_WITHIN_RANGE} 
      drawMode 
      osVectorTileApiKey=${process.env.VITE_APP_OS_VECTOR_TILES_API_KEY}
    />`);
    expect(getSnapSpy).toHaveBeenCalledOnce();
  });

  it("should load snap points on zoom into correct range", async () => {
    await setupMap(`<my-map 
      id="map-vitest" 
      zoom=${ZOOM_OUTWITH_RANGE} 
      drawMode 
      osVectorTileApiKey=${process.env.VITE_APP_OS_VECTOR_TILES_API_KEY}
    />`);
    window.olMap?.getView().setZoom(ZOOM_WITHIN_RANGE);
    window.olMap?.dispatchEvent("loadend");
    expect(getSnapSpy).toHaveBeenCalledOnce();
  });

  it("should clear snap points on zoom out of range", async () => {
    // Setup map and add a mock snap point
    await setupMap(`<my-map 
      id="map-vitest" 
      zoom=${ZOOM_WITHIN_RANGE}
      drawMode 
      osVectorTileApiKey=${process.env.VITE_APP_OS_VECTOR_TILES_API_KEY}
    />`);
    const pointsLayer = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "pointsLayer");
    const source = pointsLayer?.getSource() as VectorSource;
    const mockSnapPoint = new Feature(new Point([1, 1]));
    source?.addFeature(mockSnapPoint);
    expect(source.getFeatures()?.length).toEqual(1);

    // Zoom out to clear the point layer
    window.olMap?.getView().setZoom(ZOOM_OUTWITH_RANGE);
    window.olMap?.dispatchEvent("loadend");
    expect(getSnapSpy).toHaveBeenCalledOnce();
    expect(source.getFeatures()?.length).toEqual(0);
  });

  it("refetches snap points on a pan", async () => {
    await setupMap(`<my-map 
      id="map-vitest" 
      zoom=${ZOOM_WITHIN_RANGE}
      drawMode 
      osVectorTileApiKey=${process.env.VITE_APP_OS_VECTOR_TILES_API_KEY}
    />`);
    expect(getSnapSpy).toHaveBeenCalledTimes(1);
    window.olMap?.dispatchEvent("moveend");
    await waitForExpect(() => expect(getSnapSpy).toHaveBeenCalledTimes(2));
  });
});
