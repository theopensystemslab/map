import type { IWindow } from "happy-dom";
import { beforeEach, describe, it, expect } from "vitest";

import "./index";

declare global {
  interface Window extends IWindow {}
}

describe("PostcodeSearch with input change", async () => {
  beforeEach(async () => {
    document.body.innerHTML =
      '<postcode-search label="Test"></postcode-search>';
    await window.happyDOM.whenAsyncComplete();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it("should show label prop", () => {
    expect(
      document.body.querySelector("postcode-search")?.shadowRoot?.innerHTML
    ).toContain("Test");
  });

  it("should have a hidden error message on first render for screenreaders", () => {
    expect(
      document.body.querySelector("postcode-search")?.shadowRoot?.innerHTML
    ).toContain("govuk-error-message");
    // expect(document.body.querySelector('postcode-search')?.shadowRoot?.innerHTML).not.toContain("Enter a valid UK postcode");
  });

  it.todo("should show default error message on 'enter' key");
  it.todo("should dispatch event on input change");
  it.todo("should dispatch event with validated postcode details");
});
