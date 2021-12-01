import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { parse, toNormalised } from "postcode";

@customElement("postcode-search")
export class PostcodeSearch extends LitElement {
  @property({ type: String })
  postcode = "";

  @property({ type: Boolean })
  isValid = false;

  _onInputChange(e: any) {
    const input = e.target.value;

    if (parse(input.trim()).valid) {
      this.postcode = toNormalised(input.trim()) || input;
      this.isValid = true;
    } else if (!parse(input.trim()).valid) {
      this.postcode = input;
      this.isValid = false;
    }
  }

  render() {
    return html`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
      <div class="govuk-form-group">
        <label class="govuk-label" for="postcode"> Postcode </label>
        <!-- <span id="event-name-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">Error:</span> Enter a valid UK postcode
        </span> -->
        <input
          class="govuk-input govuk-input--width-10"
          id="postcode"
          name="postcode"
          type="text"
          autocomplete="postal-code"
          spellcheck="false"
          .value=${this.postcode}
          @input=${this._onInputChange}
        />
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "postcode-search": PostcodeSearch;
  }
}
