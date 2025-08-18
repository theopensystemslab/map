module.exports = {
  name: "MyMap - Proxy",
  description:
    "The MyMap component can either call the Ordnance Survey API directly, or via a proxy. Calling the API directly may be suitable for internal use, where exposure of API keys is not a concern, whilst calling a proxy may be more suitable for public use. Any proxy supplied via the osProxyEndpoint property must append a valid Ordnance Survey API key to all requests. For full implementation details, please see https://github.com/theopensystemslab/map/blob/main/docs/how-to-use-a-proxy.md",
  properties: [
    {
      name: "latitude",
      type: "Number",
      values: "51.507351 (default)",
      required: true,
    },
    {
      name: "longitude",
      type: "Number",
      values: "-0.127758 (default)",
      required: true,
    },
    {
      name: "projection",
      type: "String",
      values: "EPSG:4326 (default), EPSG:27700, EPSG:3857",
    },
    {
      name: "zoom",
      type: "Number",
      values: "10 (default)",
      required: true,
    },
    {
      name: "minZoom",
      type: "Number",
      values: "7 (default)",
    },
    {
      name: "maxZoom",
      type: "Number",
      values: "22 (default)",
    },
    {
      name: "hideResetControl",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "staticMode",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "showScale",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "useScaleBarStyle",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "id",
      type: "String",
      values: "map (default)",
    },
    {
      name: "ariaLabelOlFixedOverlay",
      type: "String",
      values: "An interactive map",
    },
    {
      name: "disableVectorTiles",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "osCopyright",
      type: "String",
      values: `© Crown copyright and database rights ${new Date().getFullYear()} OS AC0000812160 (default)`,
    },
    {
      name: "osVectorTileApiKey",
      type: "String",
      values: "https://osdatahub.os.uk/plans",
    },
    {
      name: "osProxyEndpoint",
      type: "String",
      values: "https://api.editor.planx.dev/proxy/ordnance-survey",
    },
  ],
  examples: [
    {
      title: "Basemap: Ordnance Survey vector tiles (proxied)",
      description:
        "Calls the Ordnance Survey Vector Tiles API via the supplied proxy endpoint. The proxy must append a valid Ordnance Survey API key to each request.",
      template: `<my-map zoom="18" osProxyEndpoint="https://api.editor.planx.dev/proxy/ordnance-survey"/>`,
    },
    {
      title: "Basemap: Ordnance Survey raster tiles (proxied)",
      description:
        "Calls the Ordnance Survey Maps API via the supplied proxy endpoint. The proxy must append a valid Ordnance Survey API key to each request.",
      template: `<my-map zoom="18" osVectorTilesApiKey="" disableVectorTiles osProxyEndpoint="https://api.editor.planx.dev/proxy/ordnance-survey"/>`,
    },
  ],
};
