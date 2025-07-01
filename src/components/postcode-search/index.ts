import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { parse, toNormalised } from "postcode";

import styles from "./styles.scss?inline";

@customElement("postcode-search")
export class PostcodeSearch extends LitElement {
  // ref https://github.com/e111077/vite-lit-element-ts-sass/issues/3
  static styles = unsafeCSS(styles);

  // configurable component properties
  @property({ type: String })
  id = "postcode";

  @property({ type: String })
  errorId = "postcode-error";

  @property({ type: String })
  label = "Postcode";

  @property({ type: String })
  hintText = "";

  @property({ type: String })
  errorMessage = "Enter a valid UK postcode";

  @property({ type: Boolean })
  onlyQuestionOnPage = false;

  // internal reactive state
  @state()
  private _postcode: string = "";

  @state()
  private _sanitizedPostcode: string | null = null;

  @state()
  private _showPostcodeError: boolean = false;

  _onInputChange(e: any) {
    // validate and set postcode
    //   <input /> uses Lit ".value" syntax to set property, whereas "value" would set attribute
    const input: string = e.target.value;
    const isValid: boolean = parse(input.trim()).valid;

    if (isValid) {
      this._sanitizedPostcode = toNormalised(input.trim());
      this._postcode = toNormalised(input.trim()) || input;
      this._showPostcodeError = false;
    } else {
      this._sanitizedPostcode = null;
      this._postcode = input.toUpperCase();
    }

    // dispatch an event on every input change
    this.dispatch("postcodeChange", {
      postcode: this._sanitizedPostcode || input,
      isValid: isValid,
    });
  }

  _onBlur() {
    if (!this._sanitizedPostcode) this._showPostcodeError = true;
    this._showError();
  }

  _onKeyUp(e: KeyboardEvent) {
    if (e.key === "Enter" && !this._sanitizedPostcode)
      this._showPostcodeError = true;
    this._showError();
  }

  // show an error message if applicable
  _showError() {
    const errorEl: HTMLElement | null | undefined =
      this.shadowRoot?.querySelector(`#${this.errorId}`);

    // display "none" ensures always present in DOM, which means role="status" will work for screenreaders
    if (errorEl) errorEl.style.display = "none";
    if (errorEl && this._showPostcodeError) errorEl.style.display = "";

    // additionally set error style on outer div to match govuk style
    const errorWrapperEl: HTMLElement | null | undefined =
      this.shadowRoot?.querySelector(`.govuk-form-group`);
    if (errorWrapperEl && this._showPostcodeError)
      errorWrapperEl.classList.add("govuk-form-group--error");
    if (errorWrapperEl && !this._showPostcodeError)
      errorWrapperEl.classList.remove("govuk-form-group--error");
  }

  // wrap the label in an h1 if it's the only question on the page
  // ref https://design-system.service.gov.uk/components/text-input/
  _makeLabel() {
    return this.onlyQuestionOnPage
      ? html`<h1 class="govuk-label-wrapper">
          <label class="govuk-label govuk-label--l" for=${this.id}>
            ${this.label}
          </label>
        </h1>`
      : html`<label class="govuk-label" for=${this.id}>${this.label}</label>`;
  }

  render() {
    return html`<div class="govuk-form-group">
      ${this._makeLabel()}
      <div id="postcode-hint" class="govuk-hint">${this.hintText}</div>
      <p
        id=${this.errorId}
        class="govuk-error-message"
        style="display:none"
        role="status"
      >
        <span class="govuk-visually-hidden">Error:</span>${this.errorMessage}
      </p>
      <input
        class="govuk-input govuk-input--width-10"
        id=${this.id}
        name="postcode"
        type="text"
        autocomplete="postal-code"
        spellcheck="false"
        aria-describedby="postcode-hint ${this.errorId}"
        .value=${this._postcode}
        @input=${this._onInputChange}
        @blur=${this._onBlur}
        @keyup=${this._onKeyUp}
        tabindex="0"
      />
    </div>`;
  }

  /**
   * dispatches an event for clients to subscribe to
   * @param eventName
   * @param payload
   */
  private dispatch = (eventName: string, payload?: any) =>
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: payload,
      }),
    );
}

declare global {
  interface HTMLElementTagNameMap {
    "postcode-search": PostcodeSearch;
  }
}
