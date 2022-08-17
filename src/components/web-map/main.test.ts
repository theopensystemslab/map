import type { IWindow } from "happy-dom";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";

import { getShadowRootEl } from "../../test-utils";

// import "./index";

declare global {
  interface Window extends IWindow {}
}

describe.todo("WebMap on initial render with OSM basemap", async () => {
  // https://stackoverflow.com/questions/61683583/openlayers-6-typeerror-url-createobjecturl-is-not-a-function
  global.URL.createObjectURL = vi.fn();

  beforeEach(async () => {
    document.body.innerHTML = '<web-map id="map-vitest" disableVectorTiles />';

    await window.happyDOM.whenAsyncComplete();
  }, 1000);

  afterEach(async () => {
    vi.resetAllMocks();
  });

  it("should be keyboard navigable", () => {
    const input = getShadowRootEl("web-map", "div");
    expect(input?.getAttribute("tabindex")).toEqual("0");
  });
});
