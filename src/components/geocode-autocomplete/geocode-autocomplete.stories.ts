import type { Meta, StoryObj } from "@storybook/web-components";
import "../../index";

const meta: Meta = {
  title: "Components/GeocodeAutocomplete",
  component: "geocode-autocomplete",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "GeocodeAutocomplete is a Lit wrapper for the Gov.UK accessible-autocomplete component that searches and suggests addresses using the Ordnance Survey Places API. The Ordnance Survey API can be called directly, or via a proxy. Calling the API directly may be suitable for internal use, where exposure of API keys is not a concern, whilst calling a proxy may be more suitable for public use. Any proxy supplied via the `osProxyEndpoint` property must append a valid Ordnance Survey API key to all requests. For full implementation details, please see https://github.com/theopensystemslab/map/blob/main/docs/how-to-use-a-proxy.md",
      },
    },
  },
  argTypes: {
    initialAddress: {
      description: "Pre-selected address value shown on first render.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: '""' },
      },
    },
    label: {
      description: "Label text displayed above the autocomplete input.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: '"Search for an address"' },
      },
    },
    arrowStyle: {
      description: "Style of the dropdown arrow icon.",
      control: { type: "select" },
      options: ["default", "light"],
      table: {
        type: { summary: '"default" | "light"' },
        defaultValue: { summary: '"default"' },
      },
    },
    labelStyle: {
      description:
        "Label layout style. `responsive` shrinks when the input is focused.",
      control: { type: "select" },
      options: ["responsive", "static"],
      table: {
        type: { summary: '"responsive" | "static"' },
        defaultValue: { summary: '"responsive"' },
      },
    },
    id: {
      description: "id attribute for the autocomplete input element.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: '"autocomplete"' },
      },
    },
    osApiKey: {
      description:
        "Ordnance Survey Places API key. Optional when using `osProxyEndpoint`. Obtain a key at https://osdatahub.os.uk/plans",
      control: "text",
      table: {
        type: { summary: "String" },
      },
    },
    osProxyEndpoint: {
      description:
        "Proxy endpoint that forwards requests to the OS Places API. The proxy must append a valid API key to each request.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: {
          summary: '"https://api.editor.planx.dev/proxy/ordnance-survey"',
        },
      },
    },
    addressSelection: {
      description:
        "Event dispatched when an address is selected. `detail` contains the full OS Places API record for that address.",
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
 * Standard case — calls the Ordnance Survey Places API directly.
 * Provide a valid `osApiKey` to fetch live address suggestions.
 * Selected address is logged to the browser console.
 */
export const DirectApiKey: Story = {
  name: "Search for an address (direct API key)",
  render: () => `<geocode-autocomplete osApiKey=""></geocode-autocomplete>`,
  play: async ({ canvasElement }) => {
    const autocomplete = canvasElement.querySelector("geocode-autocomplete");
    autocomplete?.addEventListener(
      "addressSelection",
      ({ detail: address }: CustomEvent) => {
        console.debug({ detail: address });
      },
    );
  },
};

/**
 * Calls the Ordnance Survey Places API via a proxy endpoint.
 * The proxy must append a valid Ordnance Survey API key to each request.
 */
export const ViaProxy: Story = {
  name: "Search for an address (via proxy)",
  render: () =>
    `<geocode-autocomplete osApiKey="" osProxyEndpoint="https://api.editor.planx.dev/proxy/ordnance-survey"></geocode-autocomplete>`,
  play: async ({ canvasElement }) => {
    const autocomplete = canvasElement.querySelector("geocode-autocomplete");
    autocomplete?.addEventListener(
      "addressSelection",
      ({ detail: address }: CustomEvent) => {
        console.debug({ detail: address });
      },
    );
  },
};
