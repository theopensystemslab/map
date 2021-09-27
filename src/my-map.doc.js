module.exports = {
  name: 'My map',
  description: 'An OpenLayers-powered Lit Web Component map for tasks related to planning permission in the UK.',
  properties: [
    {
      name: 'latitude',
      type: 'Number (EPSG:4326)',
      values: '51.507351 (default)',
      required: true,
    },
    {
      name: 'longitude',
      type: 'Number (EPSG:4326)',
      values: '-0.127758 (default)',
      required: true,
    },
    {
      name: 'zoom',
      type: 'Number',
      values: '10 (default)',
      required: true,
    },
    {
      name: 'minZoom',
      type: 'Number',
      values: '7 (default)'
    },
    {
      name: 'maxZoom',
      type: 'Number',
      values: '22 (default)'
    },
    {
      name: 'drawMode',
      type: 'Boolean',
      values: 'false (default)'
    },
    {
      name: 'showFeaturesAtPoint',
      type: 'Boolean',
      values: 'false (default)'
    },
    {
      name: 'clickFeatures',
      type: 'Boolean',
      values: 'false (default)'
    },
    {
      name: 'featureColor',
      type: 'String',
      values: '#0000ff (default)'
    },
    {
      name: 'featureBuffer',
      type: 'Number',
      values: '40 (default)'
    },
    {
      name: 'geojsonData',
      type: 'Object',
      values: 'GeoJSON FeatureCollection or single Feature',
    },
    {
      name: 'geojsonColor',
      type: 'String',
      values: '#ff0000 (default)'
    },
    {
      name: 'geojsonBuffer',
      type: 'Number',
      values: '12 (default)'
    },
    {
      name: 'areaUnits',
      type: 'String',
      values: 'm2 (default), ha'
    },
    {
      name: 'hideResetControl',
      type: 'Boolean',
      values: 'false (default)'
    },
    {
      name: 'staticMode',
      type: 'Boolean',
      values: 'false (default)'
    },
    {
      name: 'showScale',
      type: 'Boolean',
      values: 'false (default)'
    },
    {
      name: 'useScaleBarStyle',
      type: 'Boolean',
      values: 'false (default)'
    },
    {
      name: 'ariaLabel',
      type: 'String',
      values: 'An interactive map (default)'
    },
    {
      name: 'disableVectorTiles',
      type: 'Boolean',
      values: 'false (default)'
    },
    {
      name: 'osVectorTileApiKey',
      type: 'String',
      values: 'https://osdatahub.os.uk/plans'
    },
    {
      name: 'osFeaturesApiKey',
      type: 'String',
      values: 'https://osdatahub.os.uk/plans'
    }
  ],
  examples: [
    {
      title: 'Basemap: Ordnance Survey vector tiles',
      description: 'Requires access to the Ordnance Survey Vector Tiles API, fallsback to OpenStreetMap basemap if no key provided.',
      template: `<my-map zoom="18" osVectorTilesApiKey="" />`
    },
    {
      title: 'Basemap: Ordnance Survey raster tiles',
      description: 'Requires access to the Ordnance Survey API, fallsback to OpenStreetMap basemap if no key provided.',
      template: `<my-map zoom="18" osVectorTilesApiKey="" disableVectorTiles />`
    },
    {
      title: 'Draw mode',
      description: 'Draw and modify a site plan boundary with a red line. Use eventListeners to capture the total area and GeoJSON representation of the polygon.',
      controller: function(element) {
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
        zoom="18" 
        maxZoom="20" 
        drawMode 
        areaUnits="ha" 
        osVectorTilesApiKey="" />`
    },
    {
      title: 'Show features at point',
      description: 'Show the Ordnance Survey Features that intersect with a given coordinate.',
      template: `
      <my-map
        showFeaturesAtPoint
        latitude="51.4858363"
        longitude="-0.0761246"
        featureColor="#8a2be2" 
        osFeaturesApiKey="" 
        osVectorTilesApiKey="" />`
    }
  ]
};
