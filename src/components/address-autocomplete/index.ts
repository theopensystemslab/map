import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import accessibleAutocomplete from "accessible-autocomplete";

import styles from "./styles.scss";

type Address = {
  uprn: string;
  single_line_address: string;
};

@customElement("address-autocomplete")
export class AddressAutocomplete extends LitElement {
  static styles = unsafeCSS(styles);

  // configurable component properties
  @property({ type: String })
  postcode = "SE5 0HU"; // HP11 1BB is valid example w/ 0 results

  @property({ type: String })
  label = "Select an address";

  @property({ type: String })
  placeholder = "";

  @property({ type: String })
  osPlacesApiKey = import.meta.env.VITE_APP_OS_PLACES_API_KEY || "";

  // internal reactive state
  @state()
  private _options: string[] = [];

  @state()
  private _noAddressesInPostcode: boolean = false;

  @state()
  private _selectedAddress: Address | null = null;

  // called when DOM node is connected to the document, before render
  connectedCallback() {
    super.connectedCallback();
    this._fetchData();
  }

  // called when the component is removed from the document's DOM
  disconnectedCallback() {
    super.disconnectedCallback();
    this._options = [];
    this._noAddressesInPostcode = false;
    this._selectedAddress = null;
  }

  // called after the initial render
  firstUpdated() {
    accessibleAutocomplete({
      element: this.renderRoot.querySelector("#my-autocomplete-container"),
      id: "my-autocomplete", // must match <label>
      source: this._options,
      showAllValues: true,
      placeholder: this.placeholder,
      onConfirm: (option: any) => {
        this._selectedAddress = option;
        this.dispatch("addressSelection", { address: this._selectedAddress });
      },
    });
  }

  async _fetchData() {
    const url = `https://api.os.uk/search/places/v1/postcode?postcode=${this.postcode}&key=${this.osPlacesApiKey}&dataset=DPA&output_srs=EPSG:4326&lr=EN`;

    await fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.header.totalresults === 0) {
          this._noAddressesInPostcode = true;
        } else if (data.results.length > 0) {
          data.results.forEach((address: any) => {
            this._options.push(address["DPA"]["ADDRESS"]);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return this._noAddressesInPostcode
      ? html`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
          <div class="govuk-warning-text">
            <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
            <strong class="govuk-warning-text__text">
              <span class="govuk-warning-text__assistive">Warning</span>
              No addresses found in postcode ${this.postcode}
            </strong>
          </div>`
      : html`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/accessible-autocomplete@2.0.3/dist/accessible-autocomplete.min.css"
          />
          <label class="govuk-label" for="my-autocomplete">${this.label}</label>
          <div id="my-autocomplete-container"></div>`;
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
    "address-autocomplete": AddressAutocomplete;
  }
}
