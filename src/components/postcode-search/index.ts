import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { parse, toNormalised } from "postcode";

import styles from "./styles.scss";

@customElement("postcode-search")
export class PostcodeSearch extends LitElement {
  // ref https://github.com/e111077/vite-lit-element-ts-sass/issues/3
  static styles = unsafeCSS(styles);

  // configurable component properties
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

  _onInputChange(e: any) {
    const input: string = e.target.value;
    const isValid: boolean = parse(input.trim()).valid;

    const errorEl: HTMLElement | null | undefined =
      this.shadowRoot?.querySelector("#event-name-error");
    if (errorEl) errorEl.style.display = "none";

    if (isValid) {
      // format the user's input when validated
      this._postcode = toNormalised(input.trim()) || input;
    } else if (!isValid) {
      this._postcode = input;

      // display an error once invalid input reaches standard postcode length
      // TODO: set error classes on outer div & input to match full style?
      if (this._postcode.length >= 6 && errorEl) {
        errorEl.style.display = "";
      }
    }

    this.dispatch("postcodeChange", {
      userInput: this._postcode,
      valid: isValid,
    });
  }

  // wrap the label in an h1 if it's the only question on the page
  // ref https://design-system.service.gov.uk/components/text-input/
  _makeLabel() {
    return this.onlyQuestionOnPage
      ? html`<h1 class="govuk-label-wrapper">
          <label class="govuk-label govuk-label--l" for="postcode"
            >${this.label}</label
          >
        </h1>`
      : html`<label class="govuk-label" for="postcode">${this.label}</label>`;
  }

  render() {
    return html`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
      <div class="govuk-form-group">
        ${this._makeLabel()}
        <div id="event-name-hint" class="govuk-hint">${this.hintText}</div>
        <span
          id="event-name-error"
          class="govuk-error-message"
          style="display:none"
        >
          <span class="govuk-visually-hidden">Error:</span>${this.errorMessage}
        </span>
        <input
          class="govuk-input govuk-input--width-10"
          id="postcode"
          name="postcode"
          type="text"
          autocomplete="postal-code"
          spellcheck="false"
          aria-describedby="event-name-hint event-name-error"
          .value=${this._postcode}
          @input=${this._onInputChange}
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
      })
    );
}

declare global {
  interface HTMLElementTagNameMap {
    "postcode-search": PostcodeSearch;
  }
}