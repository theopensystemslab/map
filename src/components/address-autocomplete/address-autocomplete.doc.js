module.exports = {
  name: "AddressAutocomplete",
  description:
    "A Lit wrapper for the Gov.UK accessible-autocomplete component that fetches & displays addresses in a given postcode from the Ordnance Survey Places API.",
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
  examples: [
    {
      title: "Select an address in Lambeth postcode SE19 1NT",
      description: "Standard case",
      template: `<address-autocomplete postcode="SE19 1NT" osPlacesApiKey=${process.env.VITE_APP_OS_PLACES_API_KEY} />`,
    },
  ],
};
