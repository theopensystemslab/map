import type { IWindow } from "happy-dom";
import { beforeEach, describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { getShadowRoot, getShadowRootEl } from "../../test-utils";

import "./index";

declare global {
  interface Window extends IWindow {}
}

describe("PostcodeSearch on initial render with default props", async () => {
  beforeEach(async () => {
    document.body.innerHTML = '<postcode-search id="postcode-vitest" />';

    await window.happyDOM.whenAsyncComplete();
  }, 1000);

  it("should render a custom element with a shadow root", () => {
    const input = document.body.querySelector("postcode-search");
    expect(input).toBeTruthy;

    const inputShadowRoot = getShadowRoot("postcode-search");
    expect(inputShadowRoot).toBeTruthy;
  });

  it("should be keyboard navigable", () => {
    const input = getShadowRootEl("postcode-search", "input");
    expect(input?.getAttribute("tabindex")).toEqual("0");
  });

  it("should have a label with the default text", () => {
    const label = getShadowRootEl("postcode-search", "label");
    expect(label).toBeTruthy;
    expect(label?.innerHTML).toContain("Postcode");
    expect(label?.className).toContain("govuk-label");
  });

  it("should associate the label with the input", () => {
    const label = getShadowRootEl("postcode-search", "label");
    expect(label?.getAttribute("for")).toEqual("postcode-vitest");

    const input = getShadowRootEl("postcode-search", "input");
    expect(input?.id).toEqual("postcode-vitest");
  });

  it("should always render the error message container for screenreaders", () => {
    const error =
      getShadowRoot("postcode-search")?.getElementById("postcode-error");
    expect(error).toBeTruthy;
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
    expect(header).toBeTruthy;
    expect(header?.className).toContain("govuk-label-wrapper");
    expect(header?.innerHTML).toContain("label");
  });

  it("should show hintText if provided", async () => {
    document.body.innerHTML =
      '<postcode-search id="postcode-vitest" hintText="Enter a UK postcode, not a US zip code" />';

    await window.happyDOM.whenAsyncComplete();

    const hint =
      getShadowRoot("postcode-search")?.getElementById("postcode-hint");
    expect(hint).toBeTruthy;
    expect(hint?.className).toContain("govuk-hint");
    expect(hint?.innerHTML).toContain("Enter a UK postcode, not a US zip code");

    const input = getShadowRootEl("postcode-search", "input");
    expect(input?.getAttribute("aria-describedby")).toContain("postcode-hint");
  });
});

describe("PostcodeSearch with input change", async () => {
  beforeEach(async () => {
    document.body.innerHTML =
      '<postcode-search id="postcode-vitest" errorId="postcode-error-vitest" />';

    await window.happyDOM.whenAsyncComplete();
  }, 1000);

  it("should show error message onBlur if no valid input", async () => {
    const input = getShadowRootEl(
      "postcode-search",
      "input"
    ) as HTMLInputElement;

    // confirm error is not displayed yet (it should be _defined_ though for screenreaders)
    const error = getShadowRoot("postcode-search")?.getElementById(
      "postcode-error-vitest"
    );
    expect(error).toBeTruthy;
    expect(error?.getAttribute("style")).toContain("display:none");

    // focus & blur
    input?.focus();
    input?.blur();

    // confirm the error is now displayed
    expect(error?.getAttribute("style")).toBeNull();
    expect(error?.innerHTML).toContain("Enter a valid UK postcode");

    // confirm the error class is propagated to the entire form group
    const formGroup =
      getShadowRoot("postcode-search")?.querySelector(".govuk-form-group");
    expect(formGroup?.className).toContain("govuk-form-group--error");

    expect(input.getAttribute("aria-describedby")).toContain(
      "postcode-error-vitest"
    );
  });

  it("should dispatch event on input change", async () => {
    const spyPostcodeChange = vi.fn();

    document
      .querySelector("postcode-search")!
      .addEventListener("postcodeChange", spyPostcodeChange);

    // input is empty on render
    const input = getShadowRootEl(
      "postcode-search",
      "input"
    ) as HTMLInputElement;
    expect(input!.value).toEqual("");
    expect(spyPostcodeChange).not.toHaveBeenCalled();

    // set input value, expect event to dispatch on each character
    await userEvent.type(input, "SE5");
    expect(input!.value).toEqual("SE5");
    expect(spyPostcodeChange).toHaveBeenCalledTimes(3);
  });
});
