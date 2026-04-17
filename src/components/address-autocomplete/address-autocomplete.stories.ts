import type { Meta, StoryObj } from "@storybook/web-components";
import "../../index";

// Populated automatically when VITE_APP_OS_API_KEY is set in .env
const osApiKey = import.meta.env.VITE_APP_OS_API_KEY ?? "";

const meta: Meta = {
  title: "Components/AddressAutocomplete",
  component: "address-autocomplete",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "AddressAutocomplete is a Lit wrapper for the Gov.UK accessible-autocomplete component that fetches & displays addresses in a given postcode using the Ordnance Survey Places API. The Ordnance Survey API can be called directly, or via a proxy. Calling the API directly may be suitable for internal use, where exposure of API keys is not a concern, whilst calling a proxy may be more suitable for public use. Any proxy supplied via the `osProxyEndpoint` property must append a valid Ordnance Survey API key to all requests. For full implementation details, please see https://github.com/theopensystemslab/map/blob/main/docs/how-to-use-a-proxy.md",
      },
    },
  },
  argTypes: {
    postcode: {
      description: "UK postcode used to fetch addresses. Required.",
      control: "text",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: '"SE5 0HU"' },
      },
    },
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
        defaultValue: { summary: '"Select an address"' },
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
    osPlacesApiKey: {
      description:
        "Ordnance Survey Places API key. Required unless using `osProxyEndpoint`. Obtain a key at https://osdatahub.os.uk/plans",
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
    ready: {
      description:
        "Event dispatched before initial render. `detail` contains the number of addresses fetched for the given postcode.",
      table: {
        category: "Events",
        type: { summary: "CustomEvent" },
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
 * Provide a valid `osPlacesApiKey` to fetch live address results.
 * Events are logged to the browser console.
 */
export const DirectApiKey: Story = {
  name: "Select an address (direct API key)",
  render: () =>
    `<address-autocomplete postcode="SE19 1NT" osPlacesApiKey="${osApiKey}"></address-autocomplete>`,
  play: async ({ canvasElement }) => {
    const autocomplete = canvasElement.querySelector("address-autocomplete");
    autocomplete?.addEventListener("ready", ({ detail: data }: CustomEvent) => {
      console.debug("autocomplete ready", { data });
    });
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
  name: "Select an address (via proxy)",
  render: () =>
    `<address-autocomplete postcode="SE19 1NT" osPlacesApiKey="" osProxyEndpoint="https://api.editor.planx.dev/proxy/ordnance-survey"></address-autocomplete>`,
  play: async ({ canvasElement }) => {
    const autocomplete = canvasElement.querySelector("address-autocomplete");
    autocomplete?.addEventListener("ready", ({ detail: data }: CustomEvent) => {
      console.debug("autocomplete ready", { data });
    });
    autocomplete?.addEventListener(
      "addressSelection",
      ({ detail: address }: CustomEvent) => {
        console.debug({ detail: address });
      },
    );
  },
};
