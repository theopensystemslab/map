module.exports = {
  name: "PostcodeSearch",
  description:
    "A Lit-wrapped, Gov.UK-styled text input which validates UK postcodes using the npm package 'postcode'.",
  properties: [
    {
      name: "label",
      type: "String",
      values: "Postcode (default)",
    },
    {
      name: "onlyQuestionOnPage",
      type: "Boolean",
      values: "false (default), true if the label should be an <h1>",
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
};
