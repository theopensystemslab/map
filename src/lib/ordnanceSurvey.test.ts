import { constructURL, getServiceURL } from "./ordnanceSurvey";

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
