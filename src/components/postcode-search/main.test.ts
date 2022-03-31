import type { IWindow } from "happy-dom";
import { beforeEach, describe, it, expect } from "vitest";

import { getShadowRoot, getShadowRootEl } from "../../test-utils";

import "./index";

declare global {
  interface Window extends IWindow {}
}

describe("PostcodeSearch on initial render with default props", async () => {
  beforeEach(async () => {
    document.body.innerHTML = '<postcode-search id="postcode-vitest" />';

    await window.happyDOM.whenAsyncComplete();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it("should be keyboard navigable", () => {
    const input = getShadowRootEl("postcode-search", "input");
    expect(input?.getAttribute("tabindex")).toEqual("0");
  });

  it("should have a label with the default text", () => {
    const label = getShadowRootEl("postcode-search", "label");
    expect(label).toBeDefined;
    expect(label?.innerHTML).toContain("Postcode");
    expect(label?.className).toContain("govuk-label");
  });

  it("should associate the label with the input", () => {
    const label = getShadowRootEl("postcode-search", "label");
    expect(label?.getAttribute("for")).toEqual("postcode-vitest");

    const input = getShadowRootEl("postcode-search", "input");
    expect(input?.id).toEqual("postcode-vitest");
  });

  it("should render a visually hidden error message container for screenreaders", () => {
    const error =
      getShadowRoot("postcode-search")?.getElementById("postcode-error");
    expect(error?.className).toContain("govuk-error-message");
    expect(error?.getAttribute("role")).toEqual("status");
    expect(error?.getAttribute("style")).toContain("display:none");
  });
});

describe("PostcodeSearch on initial render with user configured props", async () => {
  it("should wrap the label in <h1> if onlyQuestionOnPage prop is set", async () => {
    document.body.innerHTML =
      '<postcode-search id="postcode-vitest" onlyQuestionOnPage />';

    await window.happyDOM.whenAsyncComplete();

    const header = getShadowRootEl("postcode-search", "h1");
    expect(header).toBeDefined;
    expect(header?.className).toContain("govuk-label-wrapper");
    expect(header?.innerHTML).toContain("label");
  });

  it("should show hintText if provided", async () => {
    document.body.innerHTML =
      '<postcode-search id="postcode-vitest" hintText="Enter a UK postcode, not a US zip code" />';

    await window.happyDOM.whenAsyncComplete();

    const hintDiv =
      getShadowRoot("postcode-search")?.getElementById("postcode-hint");
    expect(hintDiv?.className).toContain("govuk-hint");
    expect(hintDiv?.innerHTML).toContain(
      "Enter a UK postcode, not a US zip code"
    );

    const input = getShadowRootEl("postcode-search", "input");
    expect(input?.getAttribute("aria-describedby")).toContain("postcode-hint");
  });
});

describe("PostcodeSearch with input change", async () => {
  it.todo("should show error message on 'enter' key");
  it.todo("should dispatch event on input change");
});
