module.exports = {
  name: "AddressAutocomplete",
  description:
    "AddressAutocomplete is a Lit wrapper for the Gov.UK accessible-autocomplete component that fetches & displays addresses in a given postcode using the Ordnance Survey Places API.",
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
      template: `<address-autocomplete postcode="SE19 1NT" osPlacesApiKey=${process.env.VITE_APP_OS_PLACES_API_KEY} />`,
      controller: function (document) {
        const autocomplete = document.querySelector("address-autocomplete");

        autocomplete.addEventListener("ready", ({ detail: data }) => {
          console.debug("autocomplete ready", { data });
        });

        autocomplete.addEventListener(
          "addressSelection",
          ({ detail: address }) => {
            console.debug({ detail: address });
          }
        );
      },
    },
  ],
};
