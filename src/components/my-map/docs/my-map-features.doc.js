module.exports = {
  name: "MyMap - Features",
  description:
    "Features mode queries the Ordnance Survey Features API for any features that intersect the center point of the map. Should be used with the vector tiles basemap.",
  properties: [
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
      values: "",
    },
    {
      name: "featureFill",
      type: "Boolean",
      values: "false (default)",
    },
    {
      name: "featureBuffer",
      type: "Number",
      values: "40",
    },
    {
      name: "osFeaturesApiKey",
      type: "String",
      values: "https://osdatahub.os.uk/plans",
    },
    {
      name: "osVectorTileApiKey",
      type: "String",
      values: "https://osdatahub.os.uk/plans",
    },
    {
      name: "osProxyEndpoint",
      type: "String",
      values: "https://api.planx.dev/proxy/ordnance-survey",
    },
  ],
  examples: [
    {
      title: "Show features at point",
      description:
        "Show the Ordnance Survey Feature(s) that intersects with a given point.",
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
  ],
};
