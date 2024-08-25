module.exports = {
  name: "AddressAutocomplete",
  description:
    "AddressAutocomplete is a Lit wrapper for the Gov.UK accessible-autocomplete component that fetches & displays addresses in a given postcode using the Ordnance Survey Places API. The Ordnance Survey API can be called directly, or via a proxy. Calling the API directly may be suitable for internal use, where exposure of API keys is not a concern, whilst calling a proxy may be more suitable for public use. Any proxy supplied via the osProxyEndpoint property must append a valid Ordnance Survey API key to all requests. For full implementation details, please see https://github.com/theopensystemslab/map/blob/main/docs/how-to-use-a-proxy.md",
  properties: [
    {
      name: "postcode",
      type: "String",
      values: "SE5 0HU (default), any UK postcode",
      required: true,
    },
    {
      name: "initialAddress",
      type: "String",
      values: `"" (default)`,
    },
    {
      name: "label",
      type: "String",
      values: "Select an address (default)",
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
      name: "osPlacesApiKey",
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
      name: "ready",
      params: [
        {
          name: "ready",
          type: "Event Listener",
          values: "detail",
          description:
            "Dispatches the number of addresses fetched from the OS Places API for a given `postcode` when the component is connected to the DOM, before initial render",
        },
      ],
    },
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
      title: "Select an address in postcode SE19 1NT",
      description: "Standard case",
      template: `<address-autocomplete postcode="SE19 1NT" osApiKey=${process.env.VITE_APP_OS_API_KEY} />`,
      controller: function (document) {
        const autocomplete = document.querySelector("address-autocomplete");

        autocomplete.addEventListener("ready", ({ detail: data }) => {
          console.debug("autocomplete ready", { data });
        });

        autocomplete.addEventListener(
          "addressSelection",
          ({ detail: address }) => {
            console.debug({ detail: address });
          },
        );
      },
    },
    {
      title: "Select an address in postcode SE19 1NT",
      description: "Standard case (via proxy)",
      template: `<address-autocomplete postcode="SE19 1NT" osApiKey="" osProxyEndpoint="https://api.editor.planx.dev/proxy/ordnance-survey" />`,
      controller: function (document) {
        const autocomplete = document.querySelector("address-autocomplete");

        autocomplete.addEventListener("ready", ({ detail: data }) => {
          console.debug("autocomplete ready", { data });
        });

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
