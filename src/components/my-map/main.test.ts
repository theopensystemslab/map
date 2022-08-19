import type { IWindow } from "happy-dom";
import { beforeEach, describe, it, expect } from "vitest";

import { getShadowRoot } from "../../test-utils";

import "./index";

declare global {
  interface Window extends IWindow {}
}

describe("MyMap on initial render with OSM basemap", async () => {
  beforeEach(async () => {
    document.body.innerHTML = '<my-map id="map-vitest" disableVectorTiles />';

    await window.happyDOM.whenAsyncComplete();
  }, 2500);

  it("should render a custom element with a shadow root", () => {
    const map = document.body.querySelector("my-map");
    expect(map).toBeTruthy;

    const mapShadowRoot = getShadowRoot("my-map");
    expect(mapShadowRoot).toBeTruthy;
  });

  it("should be keyboard navigable", () => {
    const map = getShadowRoot("my-map")?.getElementById("map-vitest");
    expect(map).toBeTruthy;
    expect(map?.getAttribute("tabindex")).toEqual("0");
  });
});
