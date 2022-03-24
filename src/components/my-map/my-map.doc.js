module.exports = {
  name: "MyMap",
  description:
    "An OpenLayers-powered Lit web component map for tasks related to planning permission in the UK.",
  properties: [
    {
      name: "latitude",
      type: "Number (EPSG:4326)",
      values: "51.507351 (default)",
      required: true,
    },
    {
      name: "longitude",
      type: "Number (EPSG:4326)",
      values: "-0.127758 (default)",
      required: true,
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
      name: "drawMode",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "showFeaturesAtPoint",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "clickFeatures",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "featureColor",
      type: "String",
      values: "#0000ff (default)",
    },
    {
      name: "featureBuffer",
      type: "Number",
      values: "40 (default)",
    },
    {
      name: "geojsonData",
      type: "Object",
      values: "GeoJSON FeatureCollection or single Feature",
    },
    {
      name: "geojsonColor",
      type: "String",
      values: "#ff0000 (default)",
    },
    {
      name: "geojsonBuffer",
      type: "Number",
      values: "12 (default)",
    },
    {
      name: "areaUnits",
      type: "String",
      values: "m2 (default), ha",
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
      name: "ariaLabel",
      type: "String",
      values: "An interactive map (default)",
    },
    {
      name: "disableVectorTiles",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "osVectorTileApiKey",
      type: "String",
      values: "https://osdatahub.os.uk/plans",
    },
    {
      name: "osFeaturesApiKey",
      type: "String",
      values: "https://osdatahub.os.uk/plans",
    },
  ],
  examples: [
    {
      title: "Basemap: Ordnance Survey vector tiles",
      description:
        "Requires access to the Ordnance Survey Vector Tiles API, fallsback to OpenStreetMap basemap if no key provided.",
      template: `<my-map zoom="18" osVectorTilesApiKey="" />`,
    },
    {
      title: "Basemap: Ordnance Survey raster tiles",
      description:
        "Requires access to the Ordnance Survey API, fallsback to OpenStreetMap basemap if no key provided.",
      template: `<my-map zoom="18" osVectorTilesApiKey="" disableVectorTiles />`,
    },
    {
      title: "Draw mode",
      description:
        "Draw and modify a site plan boundary with a red line. Use eventListeners to calculate the total area and get the GeoJSON representation of the polygon.",
      controller: function (element) {
        const map = element.querySelector("my-map");
        map.addEventListener("areaChange", ({ detail: area }) => {
          console.debug({ area });
        });
        map.addEventListener("geojsonChange", ({ detail: geojson }) => {
          console.debug({ geojson });
        });
      },
      template: `
      <my-map 
        zoom="19" 
        maxZoom="21" 
        drawMode 
        areaUnits="ha" 
        osVectorTilesApiKey="" />`,
    },
    {
      title: "Show features at point",
      description:
        "Show the Ordnance Survey Features that intersect with a given coordinate.",
      template: `
      <my-map
        showFeaturesAtPoint
        latitude="51.4858363"
        longitude="-0.0761246"
        featureColor="#8a2be2" 
        osFeaturesApiKey="" 
        osVectorTilesApiKey="" />`,
    },
    {
      title: "Click to select and merge features",
      description:
        "Show features at point plus ability to click to select or deselect additional features to create a more accurate full site boundary.",
      template: `
      <my-map
        showFeaturesAtPoint
        clickFeatures
        latitude="51.4854329"
        longitude="-0.0761992"
        featureColor="Magenta" 
        osFeaturesApiKey="" 
        osVectorTilesApiKey="" />`,
    },
    {
      title: "Show a GeoJSON polygon on a static map",
      description:
        "Show a custom GeoJSON polygon on an OS basemap and hide the zoom & reset control buttons.",
      controller: function (element) {
        const map = element.querySelector("my-map");
        map.geojsonData = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-0.11562466621398924, 51.50746034612789],
                [-0.11449813842773436, 51.50617151942102],
                [-0.11359691619873047, 51.50653212745768],
                [-0.11348962783813477, 51.50645199258505],
                [-0.1127493381500244, 51.50665900738443],
                [-0.11383295059204103, 51.507907754128546],
                [-0.11562466621398924, 51.50746034612789],
              ],
            ],
          },
        };
      },
      template: `
      <my-map
        geojsonColor="#ff0000"
        geojsonBuffer="10"
        hideResetControl
        staticMode 
        osVectorTilesApiKey="" />`,
    },
    {
      title: "Display a scale bar on the map",
      description:
        'Display a scale bar on the map for orientation, choose between the default or "bar" styles offered by OpenLayers',
      template: `
      <my-map
        zoom="19"
        showScale
        useScaleBarStyle
        osVectorTilesApiKey="" />`,
    },
  ],
};
