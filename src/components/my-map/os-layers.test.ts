import "./index";
import { setupMap } from "../../test-utils";

import { OSM } from "ol/source";
import VectorTileSource from "ol/source/VectorTile";
import type { IWindow } from "happy-dom";

declare global {
  interface Window extends IWindow {}
}

declare global {
  interface Window extends IWindow {}
}

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
    const fetchSpy = vi.spyOn(window, "fetch");

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

  it("falls back to an OSM basemap without an OS API key or proxy endpoint", async () => {
    await setupMap(`
      <my-map id="map-vitest" disableVectorTiles osVectorTilesApiKey=""/>`);
    const rasterBaseMap = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "rasterBaseMap");
    expect(rasterBaseMap).toBeDefined();
    const source = rasterBaseMap?.getSource() as OSM;
    expect(source.getUrls()?.length).toBeGreaterThan(0);
    source
      .getUrls()
      ?.forEach((url) => expect(url).toMatch(/openstreetmap\.org/));
  });
});
