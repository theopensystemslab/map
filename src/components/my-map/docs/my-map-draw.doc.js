module.exports = {
  name: "MyMap - Drawing",
  description:
    "Drawing mode enables drawing and modifying a shape on the map. Snapping points display for guidance at zoom level 20+ when the vector tile basemap is enabled. One polygon can be drawn at a time. The reset control button will erase your drawing and re-center the map view.",
  properties: [
    {
      name: "drawMode",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "drawPointer",
      type: "String",
      values: "crosshair (default), dot",
    },
    {
      name: "drawGeojsonData",
      type: "GeoJSON Feature",
      values: `
      {
        type: "Feature",
        geometry: {},
      } 
      (default)`,
    },
    {
      name: "drawGeojsonBuffer",
      type: "Number",
      values: "100 (default)",
    },
    {
      name: "areaUnits",
      type: "String",
      values: "m2 (default), ha",
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
      title: "Draw mode",
      description:
        "Draw and modify a site plan boundary with a red line. Start at zoom 20 so snaps are visible on initial load.",
      template: `
        <my-map 
          id="draw-mode"
          zoom="20" 
          maxZoom="23" 
          drawMode 
          drawPointer="dot"
          osVectorTilesApiKey="" />`,
    },
    {
      title: "Load an initial shape onto the drawing canvas",
      description:
        "Load a polygon with the ability to continue modifying it. Click 'reset' to erase and draw fresh.",
      controller: function (element) {
        const map = element.querySelector("my-map");
        map.drawGeojsonData = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-0.07666435775970835, 51.48432362355473],
                [-0.07670012065571297, 51.48419742371502],
                [-0.07630374962243747, 51.484158450222964],
                [-0.07627692753228853, 51.484288361835524],
                [-0.07666435775970835, 51.48432362355473],
              ],
            ],
          },
        };
      },
      template: `
        <my-map 
          id="draw-mode-1"
          zoom="20" 
          maxZoom="23" 
          drawMode 
          drawPointer="dot"
          osVectorTilesApiKey="" />`,
    },
    {
      title: "Calculate the area of the drawn polygon",
      description:
        "Listen for an event when the drawn polygon is closed or modified. Specify if you want to calculate area in square metres or hectares.",
      controller: function (element) {
        const map = element.querySelector("my-map");
        map.addEventListener("areaChange", ({ detail: area }) => {
          console.debug({ area });
        });
      },
      template: `
        <my-map 
          id="draw-mode-2"
          zoom="19" 
          maxZoom="23" 
          drawMode 
          areaUnits="ha" 
          osVectorTilesApiKey="" />`,
    },
    {
      title: "Get the GeoJSON representation of the drawn polygon",
      description:
        "Listen for an event when the drawn polygon is closed or modified.",
      controller: function (element) {
        const map = element.querySelector("my-map");
        map.addEventListener("geojsonChange", ({ detail: geojson }) => {
          console.debug({ geojson });
        });
      },
      template: `
        <my-map 
          id="draw-mode-3"
          zoom="19" 
          maxZoom="23" 
          drawMode 
          osVectorTilesApiKey="" />`,
    },
  ],
};
