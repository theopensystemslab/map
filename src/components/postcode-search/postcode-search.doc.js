module.exports = {
  name: "PostcodeSearch",
  description:
    "PostcodeSearch is a Lit-wrapped, Gov.UK-styled text input that formats and validates UK postcodes using the npm package 'postcode'.",
  properties: [
    {
      name: "label",
      type: "String",
      values: "Postcode (default)",
    },
    {
      name: "hintText",
      type: "String",
      values: `"" (default)`,
    },
    {
      name: "errorMessage",
      type: "String",
      values: "Enter a valid UK postcode (default)",
    },
    {
      name: "onlyQuestionOnPage",
      type: "Boolean",
      values: "false (default), true if the label should be an <h1>",
    },
    {
      name: "id",
      type: "String",
      values: "postcode (default)",
    },
    {
      name: "errorId",
      type: "String",
      values: "postcode-error (default)",
    },
  ],
  methods: [
    {
      name: "postcodeChange",
      params: [
        {
          name: "postcodeChange",
          type: "Event Listener",
          values: "detail",
          description:
            "Dispatches on input change; returns the formatted input string and `true` if the input is a valid postcode",
        },
      ],
    },
  ],
  examples: [
    {
      title: "Enter a UK postcode",
      description: "Standard case",
      template: `<postcode-search />`,
      controller: function (document) {
        const input = document.querySelector("postcode-search");

        input.addEventListener("postcodeChange", ({ detail }) => {
          console.debug({ detail });
        });
      },
    },
  ],
};
