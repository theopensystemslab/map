import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import accessibleAutocomplete from "accessible-autocomplete";

import styles from "./styles.scss";

// https://apidocs.os.uk/docs/os-places-lpi-output
type Address = {
  LPI: any;
};

@customElement("address-autocomplete")
export class AddressAutocomplete extends LitElement {
  // ref https://github.com/e111077/vite-lit-element-ts-sass/issues/3
  static styles = unsafeCSS(styles);

  // configurable component properties
  @property({ type: String })
  id = "autocomplete";

  @property({ type: String })
  postcode = "SE5 0HU";

  @property({ type: String })
  label = "Select an address";

  @property({ type: String })
  initialAddress = "";

  @property({ type: String })
  osPlacesApiKey = import.meta.env.VITE_APP_OS_PLACES_API_KEY || "";

  // internal reactive state
  @state()
  private _totalAddresses: number | undefined = undefined;

  @state()
  private _addressesInPostcode: Address[] = [];

  @state()
  private _options: string[] = [];

  @state()
  private _selectedAddress: Address | null = null;

  @state()
  private _osError: string | undefined = undefined;

  // called when DOM node is connected to the document, before render
  connectedCallback() {
    super.connectedCallback();
    this._fetchData();
  }

  // called when the component is removed from the document's DOM
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // called after the initial render
  firstUpdated() {
    // https://github.com/alphagov/accessible-autocomplete
    accessibleAutocomplete({
      element: this.renderRoot.querySelector(`#${this.id}-container`),
      id: this.id,
      required: true,
      source: this._options,
      defaultValue: this.initialAddress,
      showAllValues: true,
      tNoResults: () => "No addresses found",
      onConfirm: (option: any) => {
        this._selectedAddress = this._addressesInPostcode.filter(
          (address) =>
            address.LPI.ADDRESS.split(
              `, ${address.LPI.ADMINISTRATIVE_AREA}`
            )[0] === option
        )[0];
        if (this._selectedAddress)
          this.dispatch("addressSelection", { address: this._selectedAddress });
      },
    });
  }

  async _fetchData(offset: number = 0, prevResults: any[] = []) {
    // https://apidocs.os.uk/docs/os-places-service-metadata
    const params: Record<string, string> = {
      postcode: this.postcode,
      dataset: "LPI", // or "DPA" for only mailable addresses
      maxResults: "100",
      output_srs: "EPSG:4326",
      lr: "EN",
      key: this.osPlacesApiKey,
    };
    const url = `https://api.os.uk/search/places/v1/postcode?${new URLSearchParams(
      params
    ).toString()}`;

    await fetch(url + `&offset=${offset}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error) {
          this._osError = data.error.message;
        }

        this._totalAddresses = data.header?.totalresults;

        // concatenate full results
        const concatenated = prevResults.concat(data.results || []);
        this._addressesInPostcode = concatenated;
        this.dispatch("ready", {
          postcode: this.postcode,
          addresses: `fetched ${this._addressesInPostcode.length}/${this._totalAddresses}`,
        });

        // format & sort list of address "titles" that will be visible in dropdown
        if (data.results) {
          data.results
            .filter(
              (address: Address) =>
                address.LPI.LPI_LOGICAL_STATUS_CODE_DESCRIPTION === "APPROVED"
            )
            .map((address: Address) => {
              // omit the council and postcode from the display name
              this._options.push(
                address.LPI.ADDRESS.split(
                  `, ${address.LPI.ADMINISTRATIVE_AREA}`
                )[0]
              );
            });

          const collator = new Intl.Collator([], { numeric: true });
          this._options.sort((a, b) => collator.compare(a, b));
        }

        // fetch next page of results if they exist
        if (
          this._totalAddresses &&
          this._totalAddresses > this._addressesInPostcode.length
        ) {
          this._fetchData(
            this._addressesInPostcode.length,
            this._addressesInPostcode
          );
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    // handle various error states
    let errorMessage;
    if (!this.osPlacesApiKey) errorMessage = "Missing OS Places API key";
    else if (this._osError) errorMessage = this._osError;
    else if (this._totalAddresses === 0)
      errorMessage = `No addresses found in postcode ${this.postcode}`;
    else errorMessage = "Something went wrong";

    return !this.osPlacesApiKey || this._osError || this._totalAddresses === 0
      ? html`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
          <div class="govuk-warning-text" role="status">
            <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
            <strong class="govuk-warning-text__text">
              <span class="govuk-warning-text__assistive">Warning</span>
              ${errorMessage}
            </strong>
          </div>`
      : html`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/accessible-autocomplete@2.0.4/dist/accessible-autocomplete.min.css"
          />
          <label class="govuk-label" htmlFor=${this.id}> ${this.label} </label>
          <div id="${this.id}-container" role="status"></div>`;
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
