import "./index";
import { constructURL, getServiceURL } from "./os-layers";
import { setupMap } from "../../test-utils";

import VectorTileSource from "ol/source/VectorTile";
import type { IWindow } from "happy-dom";

declare global {
  interface Window extends IWindow {}
}

declare global {
  interface Window extends IWindow {}
}

describe("constructURL helper function", () => {
  test("simple URL construction", () => {
    const result = constructURL(
      "https://www.test.com",
      "/my-path/to-something"
    );
    expect(result).toEqual("https://www.test.com/my-path/to-something");
  });

  test("URL with query params construction", () => {
    const result = constructURL(
      "https://www.test.com",
      "/my-path/to-something",
      { test: "params", test2: "more-params" }
    );
    expect(result).toEqual(
      "https://www.test.com/my-path/to-something?test=params&test2=more-params"
    );
  });
});

describe("getServiceURL helper function", () => {
  it("returns an OS service URL if an API key is passed in", () => {
    const result = getServiceURL({
      service: "vectorTile",
      apiKey: "my-api-key",
    });

    expect(result).toBeDefined();
    const { origin, pathname, searchParams } = new URL(result!);
    expect(origin).toEqual("https://api.os.uk");
    expect(decodeURIComponent(pathname)).toEqual(
      "/maps/vector/v1/vts/tile/{z}/{y}/{x}.pbf"
    );
    expect(searchParams.get("key")).toEqual("my-api-key");
    expect(searchParams.get("srs")).toEqual("3857");
  });

  it("returns a proxy service URL if a proxy endpoint is passed in", () => {
    const result = getServiceURL({
      service: "vectorTileStyle",
      proxyEndpoint: "https://www.my-site.com/api/proxy/os",
    });

    expect(result).toBeDefined();
    const { origin, pathname, searchParams } = new URL(result!);
    expect(origin).toEqual("https://www.my-site.com");
    expect(decodeURIComponent(pathname)).toEqual(
      "/api/proxy/os/maps/vector/v1/vts/resources/styles"
    );
    expect(searchParams.get("srs")).toEqual("3857");
  });

  it("returns a proxy service URL if a proxy endpoint is passed in (with a trailing slash)", () => {
    const result = getServiceURL({
      service: "xyz",
      proxyEndpoint: "https://www.my-site.com/api/proxy/os/",
    });

    expect(result).toBeDefined();
    const { origin, pathname } = new URL(result!);
    expect(origin).toEqual("https://www.my-site.com");
    expect(decodeURIComponent(pathname)).toEqual(
      "/api/proxy/os/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png"
    );
  });

  it("returns undefined without an API key or proxy endpoint", () => {
    const result = getServiceURL({ service: "xyz" });
    expect(result).toBeUndefined();
  });
});

describe("OS Layer loading", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("requests layers directly from OS when an API key is provided", async () => {
    const apiKey = process.env.VITE_APP_OS_VECTOR_TILES_API_KEY;
    await setupMap(`
      <my-map 
        id="map-vitest" 
        osVectorTileApiKey=${apiKey}
      />`);
    const vectorBaseMap = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "vectorBaseMap");
    expect(vectorBaseMap).toBeDefined();
    const source = vectorBaseMap?.getSource() as VectorTileSource;
    expect(source.getUrls()).toHaveLength(1);
    expect(source.getUrls()?.[0]).toEqual(
      expect.stringMatching(/^https:\/\/api.os.uk/)
    );
    expect(source.getUrls()?.[0]).toEqual(
      expect.stringContaining(`key=${apiKey}`)
    );
  });

  it("requests layers via proxy when an API key is not provided", async () => {
    const fetchSpy = vi.spyOn(window, "fetch").mockResolvedValue({
      json: async () => ({ version: 8, layers: [] }),
    });

    const osProxyEndpoint = "https://www.my-site.com/api/v1/os";
    await setupMap(`
      <my-map 
        id="map-vitest" 
        osProxyEndpoint=${osProxyEndpoint}
      />`);
    const vectorBaseMap = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "vectorBaseMap");
    expect(vectorBaseMap).toBeDefined();
    const source = vectorBaseMap?.getSource() as VectorTileSource;

    // Tiles are being requested via proxy
    expect(source.getUrls()).toHaveLength(1);
    expect(source.getUrls()?.[0]).toEqual(
      expect.stringContaining(osProxyEndpoint)
    );
    // Style is being fetched via proxy
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://www.my-site.com/api/v1/os/maps/vector/v1/vts/resources/styles?srs=3857"
    );
  });
});
