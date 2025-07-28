module.exports = {
  name: "GeocodeAutocomplete",
  description:
    "GeocodeAutocomplete is a Lit wrapper for the Gov.UK accessible-autocomplete component that searches and suggests addresses using the Ordnance Survey Places API. The Ordnance Survey API can be called directly, or via a proxy. Calling the API directly may be suitable for internal use, where exposure of API keys is not a concern, whilst calling a proxy may be more suitable for public use. Any proxy supplied via the osProxyEndpoint property must append a valid Ordnance Survey API key to all requests. For full implementation details, please see https://github.com/theopensystemslab/map/blob/main/docs/how-to-use-a-proxy.md",
  properties: [
    {
      name: "initialAddress",
      type: "String",
      values: `"" (default)`,
    },
    {
      name: "label",
      type: "String",
      values: "Search for an address (default)",
    },
    {
      name: "arrowStyle",
      type: "String",
      values: `default (default), light`,
    },
    {
      name: "labelStyle",
      type: "String",
      values: `responsive (default), static`,
    },
    {
      name: "id",
      type: "String",
      values: "autocomplete (default)",
    },
    {
      name: "osApiKey",
      type: "String",
      values: "https://osdatahub.os.uk/plans",
      required: true,
    },
    {
      name: "osProxyEndpoint",
      type: "String",
      values: "https://api.editor.planx.dev/proxy/ordnance-survey",
    },
  ],
  methods: [
    {
      name: "addressSelection",
      params: [
        {
          name: "addressSelection",
          type: "Event Listener",
          values: "detail",
          description:
            "Dispatches the OS Places API record for an individual address when it's selected from the dropdown",
        },
      ],
    },
  ],
  examples: [
    {
      title: "Search for an address",
      description: "Standard case",
      template: `<geocode-autocomplete osApiKey=${process.env.VITE_APP_OS_API_KEY} />`,
      controller: function (document) {
        const autocomplete = document.querySelector("geocode-autocomplete");

        autocomplete.addEventListener(
          "addressSelection",
          ({ detail: address }) => {
            console.debug({ detail: address });
          },
        );
      },
    },
    {
      title: "Search for an address",
      description: "Standard case (via proxy)",
      template: `<geocode-autocomplete osApiKey="" osProxyEndpoint="https://api.editor.planx.dev/proxy/ordnance-survey" />`,
      controller: function (document) {
        const autocomplete = document.querySelector("geocode-autocomplete");

        autocomplete.addEventListener(
          "addressSelection",
          ({ detail: address }) => {
            console.debug({ detail: address });
          },
        );
      },
    },
  ],
};
