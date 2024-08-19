import type { IWindow } from "happy-dom";
import { beforeEach, describe, it, expect } from "vitest";

import { getShadowRoot, getShadowRootEl } from "../../test-utils";

import "./index";

declare global {
  interface Window extends IWindow {}
}

test.todo(
  "Replace environment variable prop dependency with mock response. Ref https://vitest.dev/guide/mocking.html",
);

describe("AddressAutocomplete on initial render with valid postcode", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `<address-autocomplete id="autocomplete-vitest" postcode="SE5 0HU" osApiKey=${import.meta.env.VITE_APP_OS_API_KEY} />`;
    await window.happyDOM.whenAsyncComplete();
  }, 2500);

  it("should render a custom element with a shadow root", () => {
    const autocomplete = document.body.querySelector("address-autocomplete");
    expect(autocomplete).toBeTruthy;

    const autocompleteShadowRoot = getShadowRoot("address-autocomplete");
    expect(autocompleteShadowRoot).toBeTruthy;
  });

  it("should have an input with autocomplete attributes", () => {
    const input = getShadowRootEl("address-autocomplete", "input");
    expect(input).toBeTruthy;
    expect(input?.getAttribute("role")).toEqual("combobox");
    expect(input?.getAttribute("type")).toEqual("text");
    expect(input?.getAttribute("aria-autocomplete")).toEqual("list");
    expect(input?.getAttribute("aria-expanded")).toEqual("false");
    expect(input?.getAttribute("autocomplete")).toEqual("off");
  });

  it("should have a label with the default text", () => {
    const label = getShadowRootEl("address-autocomplete", "label");
    expect(label).toBeTruthy;
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
    const error = getShadowRoot("address-autocomplete")?.getElementById(
      "error-message-container",
    );
    expect(error).toBeTruthy;
  });
});

describe("AddressAutocomplete on initial render with empty postcode", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `<address-autocomplete id="autocomplete-vitest" postcode="HP11 1BR" osApiKey=${import.meta.env.VITE_APP_OS_API_KEY} />`;
    await window.happyDOM.whenAsyncComplete();
  }, 500);

  it.todo("renders a 'no addresses in this postcode' warning", () => {
    const autocomplete = getShadowRoot("address-autocomplete");
    console.log(autocomplete?.innerHTML); // pnpm test:ui
    expect(autocomplete?.innerHTML).toContain(
      "No addresses found in postcode HP11 1BR",
    );
  });
});

describe("External API calls", async () => {
  const fetchSpy = vi.spyOn(window, "fetch");

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Component makes a request for styles and tiles in a non-determintic manner
  const lastTwoCalls = () => fetchSpy.mock.calls?.slice(-2).join(", ");

  it("calls proxy when 'osProxyEndpoint' provided", async () => {
    document.body.innerHTML = `<address-autocomplete id="autocomplete-vitest" postcode="SE5 0HU" osApiKey="" osProxyEndpoint="https://www.my-site.com/api/v1/os" />`;
    await window.happyDOM.whenAsyncComplete();

    expect(fetchSpy).toHaveBeenCalled();
    expect(lastTwoCalls()).toContain(
      "https://www.my-site.com/api/v1/os/search/places/v1/postcode?postcode=SE5+0HU",
    );
    expect(fetchSpy.mock.calls?.[0]).not.toContain("&key=");
  });

  it("calls OS API when 'osApiKey' provided", async () => {
    const mockAPIKey = "test-test-test";
    document.body.innerHTML = `<address-autocomplete id="autocomplete-vitest" postcode="SE5 0HU" osApiKey=${mockAPIKey} />`;
    await window.happyDOM.whenAsyncComplete();

    expect(fetchSpy).toHaveBeenCalled();
    expect(lastTwoCalls()).toContain(
      "https://api.os.uk/search/places/v1/postcode?postcode=SE5+0HU",
    );
    expect(lastTwoCalls()).toContain(`&key=${mockAPIKey}`);
  });
});
