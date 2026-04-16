import type { Meta, StoryObj } from "@storybook/web-components";
import "../../index";

const meta: Meta = {
  title: "Components/PostcodeSearch",
  component: "postcode-search",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "PostcodeSearch is a Lit-wrapped, Gov.UK-styled text input that formats and validates UK postcodes using the npm package 'postcode'.",
      },
    },
  },
  argTypes: {
    label: {
      description: "Label text displayed above the input.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: '"Postcode"' },
      },
    },
    hintText: {
      description: "Optional hint text displayed below the label.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: '""' },
      },
    },
    errorMessage: {
      description:
        "Error message shown when the entered value is not a valid UK postcode.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: '"Enter a valid UK postcode"' },
      },
    },
    onlyQuestionOnPage: {
      description: "When true, the label is rendered as an &lt;h1&gt;.",
      control: "boolean",
      table: {
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    id: {
      description: "id attribute for the underlying input element.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: '"postcode"' },
      },
    },
    errorId: {
      description: "id attribute for the error message element.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: '"postcode-error"' },
      },
    },
    postcodeChange: {
      description:
        "Event dispatched on input change. `detail` contains `{ postcode: string, isValid: boolean }`.",
      table: {
        category: "Events",
        type: { summary: "CustomEvent" },
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Standard case. Enter any valid UK postcode and listen for the
 * `postcodeChange` event in the browser console.
 */
export const EnterAUKPostcode: Story = {
  name: "Enter a UK postcode",
  render: () => `<postcode-search></postcode-search>`,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector("postcode-search");
    input?.addEventListener("postcodeChange", ({ detail }: CustomEvent) => {
      console.debug({ detail });
    });
  },
};
