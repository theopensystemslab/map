module.exports = {
  name: "MyMap - GeoJSON",
  description:
    "GeoJSON mode displays a static polygon on the map. The map view will center on the shape, overriding the latitude, longitude, and zoom properties. Use the geojsonBuffer property to control the padding between the shape and edge of the map view.",
  properties: [
    {
      name: "geojsonData",
      type: "GeoJSON FeatureCollection or Feature",
      values: `
      {
        type: "FeatureCollection",
        features: [],
      }
      (default)
      `,
    },
    {
      name: "geojsonColor",
      type: "String",
      values: "#ff0000 (default)",
    },
    {
      name: "geojsonFill",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "geojsonBuffer",
      type: "Number",
      values: "12",
    },
    {
      name: "osProxyEndpoint",
      type: "String",
      values: "https://api.1334.planx.pizza/proxy/ordnance-survey",
    },
  ],
  examples: [
    {
      title: "Show a GeoJSON polygon on a static map",
      description:
        "Show a custom GeoJSON polygon on an OS basemap. Hide the zoom & reset control buttons.",
      template: `
        <my-map
          geojsonColor="#ff0000"
          geojsonBuffer="10"
          hideResetControl
          staticMode 
          osVectorTilesApiKey="" 
          geojsonData=${JSON.stringify({
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
          })}
        />`,
    },
  ],
};
