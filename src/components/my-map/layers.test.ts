import { setupMap } from "../../test-utils";
import "./index";

import type { IWindow } from "happy-dom";
import { OSM, XYZ } from "ol/source";
import VectorTileSource from "ol/source/VectorTile";

declare global {
  interface Window extends IWindow {}
}

declare global {
  interface Window extends IWindow {}
}

describe("Basemap layer loading", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("loads OSVectorTile basemap by default and requests layers directly from OS when an API key is provided", async () => {
    const apiKey = process.env.VITE_APP_OS_VECTOR_TILES_API_KEY;
    await setupMap(`
      <my-map 
        id="map-vitest" 
        osVectorTileApiKey=${apiKey}
      />`);
    const vectorBasemap = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "osVectorTileBasemap");
    expect(vectorBasemap).toBeDefined();
    const source = vectorBasemap?.getSource() as VectorTileSource;
    expect(source.getUrls()).toHaveLength(1);
    expect(source.getUrls()?.[0]).toEqual(
      expect.stringMatching(/^https:\/\/api.os.uk/),
    );
    expect(source.getUrls()?.[0]).toEqual(
      expect.stringContaining(`key=${apiKey}`),
    );
  });

  it("loads OSVectorTile basemap by default and requests layers via proxy when an API key is not provided", async () => {
    const fetchSpy = vi.spyOn(window, "fetch");

    const osProxyEndpoint = "https://www.my-site.com/api/v1/os";
    await setupMap(`
      <my-map 
        id="map-vitest" 
        osProxyEndpoint=${osProxyEndpoint}
      />`);
    const vectorBasemap = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "osVectorTileBasemap");
    expect(vectorBasemap).toBeDefined();
    const source = vectorBasemap?.getSource() as VectorTileSource;

    // Tiles are being requested via proxy
    expect(source.getUrls()).toHaveLength(1);
    expect(source.getUrls()?.[0]).toEqual(
      expect.stringContaining(osProxyEndpoint),
    );
    // Style is being fetched via proxy
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://www.my-site.com/api/v1/os/maps/vector/v1/vts/resources/styles?srs=3857",
    );
  });

  it("loads OSRaster basemap when an OS API key is provided", async () => {
    const apiKey = process.env.VITE_APP_OS_VECTOR_TILES_API_KEY;
    await setupMap(`
      <my-map 
        id="map-vitest" 
        basemap="OSRaster"
        osVectorTileApiKey=${apiKey}
      />`);
    const rasterBasemap = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "osRasterBasemap");
    expect(rasterBasemap).toBeDefined();
    const source = rasterBasemap?.getSource() as XYZ;
    expect(source.getUrls()?.length).toBeGreaterThan(0);
    source.getUrls()?.forEach((url) => expect(url).toMatch(/api.os.uk/));
  });

  it.skip("loads MapboxSatellite basemap when a Mapbox access token is provided", async () => {
    const accessToken = process.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
    await setupMap(
      `<my-map id="map-vitest" basemap="MapboxSatellite" mapboxAccessToken=${accessToken}`,
    );
    const satelliteBasemap = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "mapboxSatelliteBasemap"); // 'name' not getting set?
    expect(satelliteBasemap).toBeDefined();
  });

  it("loads OSM basemap when specified", async () => {
    await setupMap(`<my-map id="map-vitest" basemap="OSM" />`);
    const osmBasemap = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "osmBasemap");
    expect(osmBasemap).toBeDefined();
    const source = osmBasemap?.getSource() as OSM;
    expect(source.getUrls()?.length).toBeGreaterThan(0);
    source
      .getUrls()
      ?.forEach((url) => expect(url).toMatch(/openstreetmap\.org/));
  });

  it("fallsback to an OSM basemap when an OS basemap is specified without an OS API key or proxy endpoint", async () => {
    await setupMap(`
      <my-map id="map-vitest" basemap="OSVectorTile" osVectorTilesApiKey=${undefined} />`);
    const osmBasemap = window.olMap
      ?.getAllLayers()
      .find((layer) => layer.get("name") === "osmBasemap");
    expect(osmBasemap).toBeDefined();
    const source = osmBasemap?.getSource() as OSM;
    expect(source.getUrls()?.length).toBeGreaterThan(0);
    source
      .getUrls()
      ?.forEach((url) => expect(url).toMatch(/openstreetmap\.org/));
  });
});
