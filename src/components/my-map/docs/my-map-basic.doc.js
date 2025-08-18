module.exports = {
  name: "MyMap - Basic",
  description:
    "MyMap is an OpenLayers-powered Lit web component map for tasks related to planning permission in the UK. These examples cover the foundational properties used to render and style the map.",
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
      title: "Basemap: Ordnance Survey vector tiles",
      description:
        "Requires access to the Ordnance Survey Vector Tiles API, fallsback to OpenStreetMap basemap if no key is provided.",
      template: `<my-map zoom="18" osVectorTilesApiKey="" />`,
    },
    {
      title: "Basemap: Ordnance Survey raster tiles",
      description:
        "Requires access to the Ordnance Survey Maps API, fallsback to OpenStreetMap basemap if no key provided.",
      template: `<my-map zoom="18" osVectorTilesApiKey="" disableVectorTiles />`,
    },
    {
      title: "Display a static map",
      description:
        "Disable zooming, panning, and other map interactions. Hide the reset control button.",
      template: `
        <my-map
          zoom="20"
          staticMode
          hideResetControl
          osVectorTilesApiKey="" />`,
    },
    {
      title: "Display a scale bar on the map",
      description:
        'Display a scale bar on the map for orientation, choose between the default or "bar" styles offered by OpenLayers',
      template: `
        <my-map
          zoom="20"
          showScale
          useScaleBarStyle
          osVectorTilesApiKey="" />`,
    },
  ],
};
