import type { IWindow } from "happy-dom";
import { beforeEach, describe, it, expect } from "vitest";

import { getShadowRoot, getShadowRootEl } from "../../test-utils";

import "./index";

declare global {
  interface Window extends IWindow {}
}

test.todo(
  "Replace environment variable prop dependency with mock response. Ref https://vitest.dev/guide/mocking.html"
);

describe("AddressAutocomplete on initial render with valid postcode", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `<address-autocomplete id="autocomplete-vitest" postcode="SE5 0HU" osPlacesApiKey=${
      import.meta.env.VITE_APP_OS_PLACES_API_KEY
    } />`;

    await window.happyDOM.whenAsyncComplete();
  }, 2500);

  it("renders the autocomplete without a warning", () => {
    const autocomplete = getShadowRoot("address-autocomplete");
    expect(autocomplete?.getElementById("autocomplete-vitest-container"))
      .toBeDefined;
    expect(autocomplete?.innerHTML).toContain("combobox");
  });

  it("should have a label with the default text", () => {
    const label = getShadowRootEl("address-autocomplete", "label");
    expect(label).toBeDefined;
    expect(label?.className).toContain("govuk-label");
    expect(label?.innerHTML).toContain("Select an address");
  });

  it("should associate the label with the input", () => {
    const label = getShadowRootEl("address-autocomplete", "label");
    expect(label?.getAttribute("for")).toEqual("autocomplete-vitest");

    const input = getShadowRootEl("address-autocomplete", "input");
    expect(input?.id).toEqual("autocomplete-vitest");
  });

  it("should always render the warning message container for screenreaders", () => {
    const autocomplete = getShadowRoot("address-autocomplete");
    expect(autocomplete?.getElementById("error-message-container")).toBeDefined;
  });
});

describe("AddressAutocomplete on initial render with empty postcode", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `<address-autocomplete id="autocomplete-vitest" postcode="HP11 1BR" osPlacesApiKey=${
      import.meta.env.VITE_APP_OS_PLACES_API_KEY
    } />`;

    await window.happyDOM.whenAsyncComplete();
  }, 500);

  it.todo("renders a 'no addresses in this postcode' warning", () => {
    const autocomplete = getShadowRoot("address-autocomplete");
    console.log(autocomplete?.innerHTML); // pnpm test:ui
    expect(autocomplete?.innerHTML).toContain(
      "No addresses found in postcode HP11 1BR"
    );
  });
});
