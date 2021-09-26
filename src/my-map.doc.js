module.exports = {
  name: 'My Map',
  description: 'A map.',
  properties: [
    {
      name: 'latitude',
      type: 'Number',
    },
    {
      name: 'longitude',
      type: 'Number',
    },
    {
      name: 'zoom',
      type: 'Number',
    },
    {
      name: 'drawMode',
      type: 'Boolean',
    },
    {
      name: 'areaUnits',
      type: 'String',
      values: 'm2, ha'
    }
  ],
  examples: [
    {
      title: 'Basemap: Ordnance Survey vector tiles',
      template: `<my-map zoom="18" osVectorTilesApiKey="secret" />`
    },
    {
      title: 'Basemap: Ordnance Survey raster tiles',
      template: `<my-map zoom="18" osVectorTilesApiKey="secret" disableVectorTiles />`
    },
    {
      title: 'Interaction: Draw mode',
      controller: function(element) {
        const map = element.querySelector("my-map");
        map.addEventListener("areaChange", ({ detail: area }) => {
          console.debug({ area });
        });
        map.addEventListener("geojsonChange", ({ detail: geojson }) => {
          console.debug({ geojson });
        });
      },
      template: `<my-map zoom="18" maxZoom="20" drawMode />`
    },
  ]
};
