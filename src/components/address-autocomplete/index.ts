import { html, LitElement, TemplateResult, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import accessibleAutocomplete from "accessible-autocomplete";

import styles from "./styles.scss?inline";
import { getServiceURL } from "../../lib/ordnanceSurvey";

// https://apidocs.os.uk/docs/os-places-lpi-output
type Address = {
  LPI: any;
};

type ArrowStyleEnum = "default" | "light";
type LabelStyleEnum = "responsive" | "static";

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
  osApiKey = "";

  /**
   * @deprecated - please set singular `osApiKey`
   */
  @property({ type: String })
  osPlacesApiKey = "";

  @property({ type: String })
  osProxyEndpoint = "";

  @property({ type: String })
  arrowStyle: ArrowStyleEnum = "default";

  @property({ type: String })
  labelStyle: LabelStyleEnum = "responsive";

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

  _getLightDropdownArrow() {
    return '<svg class="autocomplete__dropdown-arrow-down" style="height: 17px;" viewBox="0 0 512 512" ><path d="M256,298.3L256,298.3L256,298.3l174.2-167.2c4.3-4.2,11.4-4.1,15.8,0.2l30.6,29.9c4.4,4.3,4.5,11.3,0.2,15.5L264.1,380.9  c-2.2,2.2-5.2,3.2-8.1,3c-3,0.1-5.9-0.9-8.1-3L35.2,176.7c-4.3-4.2-4.2-11.2,0.2-15.5L66,131.3c4.4-4.3,11.5-4.4,15.8-0.2L256,298.3  z"/></svg>';
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
      displayMenu: "overlay",
      dropdownArrow:
        this.arrowStyle === "light" ? this._getLightDropdownArrow : undefined,
      tNoResults: () => "No addresses found",
      onConfirm: (option: string) => {
        this._selectedAddress = this._addressesInPostcode.filter(
          (address) =>
            address.LPI.ADDRESS.slice(
              0,
              address.LPI.ADDRESS.lastIndexOf(
                `, ${address.LPI.ADMINISTRATIVE_AREA}`,
              ),
            ) === option,
        )[0];
        if (this._selectedAddress)
          this.dispatch("addressSelection", { address: this._selectedAddress });
      },
    });
  }

  async _fetchData(offset: number = 0, prevResults: Address[] = []) {
    const isUsingOS = Boolean(this.osApiKey || this.osProxyEndpoint);
    if (!isUsingOS)
      throw Error("OS Places API key or OS proxy endpoint not found");

    // https://apidocs.os.uk/docs/os-places-service-metadata
    const params: Record<string, string> = {
      postcode: this.postcode,
      dataset: "LPI", // or "DPA" for only mailable addresses
      maxResults: "100",
      output_srs: "EPSG:4326",
      lr: "EN",
      offset: offset.toString(),
    };
    const url = getServiceURL({
      service: "places",
      apiKey: this.osApiKey,
      proxyEndpoint: this.osProxyEndpoint,
      params,
    });

    await fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        // handle error formats returned by OS
        if (data.error || data.fault) {
          this._osError =
            data.error?.message ||
            data.fault?.faultstring ||
            "Something went wrong";
        }

        this._totalAddresses = data.header?.totalresults;

        // concatenate full results
        const concatenated = prevResults.concat(data.results || []);
        this._addressesInPostcode = concatenated;

        this.dispatch("ready", {
          postcode: this.postcode,
          status: `fetched ${this._addressesInPostcode.length}/${this._totalAddresses} addresses`,
        });

        // format & sort list of address "titles" that will be visible in dropdown
        if (data.results) {
          data.results
            .filter(
              (address: Address) =>
                // filter out "ALTERNATIVE", "HISTORIC", and "PROVISIONAL" records
                address.LPI.LPI_LOGICAL_STATUS_CODE_DESCRIPTION === "APPROVED",
            )
            .sort((a: Address, b: Address) => {
              // addresses are currently in OS Places default order (API does not support sorting directly)
              //  - the default order separates parent properties from flats and orders addresses like 1, 10..., 2 etc
              //  - we want to first sort street numbers like 1, 2 ... 10, then ensure flats appear beside their parent shells in the list of options
              const collator = new Intl.Collator([], { numeric: true });
              if (a.LPI?.PAO_START_NUMBER && b.LPI?.PAO_START_NUMBER) {
                collator.compare(
                  a.LPI.PAO_START_NUMBER,
                  b.LPI.PAO_START_NUMBER,
                );
              }
              if (a.LPI?.SAO_TEXT && b.LPI?.SAO_TEXT) {
                collator.compare(a.LPI.SAO_TEXT, b.LPI.SAO_TEXT);
              }
            })
            .map((address: Address) => {
              // omit the council name and postcode from the display name
              this._options.push(
                address.LPI.ADDRESS.slice(
                  0,
                  address.LPI.ADDRESS.lastIndexOf(
                    `, ${address.LPI.ADMINISTRATIVE_AREA}`,
                  ),
                ),
              );
            });
        }

        // fetch next page of results if they exist
        if (
          this._totalAddresses &&
          this._totalAddresses > this._addressesInPostcode.length
        ) {
          this._fetchData(
            this._addressesInPostcode.length,
            this._addressesInPostcode,
          );
        }
      })
      .catch((error) => console.log(error));
  }

  _getLabelClasses() {
    let styles = "govuk-label";
    if (this.labelStyle === "static") {
      styles += " govuk-label--static";
    }
    return styles;
  }

  /**
   * Render an errorMessage container
   * Must always be visible to ensure that role="status" works for screenreaders
   * @param errorMessage
   * @returns TemplateResult
   */
  _getErrorMessageContainer(errorMessage: string | undefined): TemplateResult {
    const className = errorMessage ? "govuk-warning-text" : "";
    const content = errorMessage
      ? html` <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-warning-text__assistive">Warning</span>
            ${errorMessage}
          </strong>`
      : null;

    return html`<div
      id="error-message-container"
      class="${className}"
      role="status"
    >
      ${content}
    </div>`;
  }

  /**
   * If not in state of error, return the autocomplete
   * @param errorMessage
   * @returns TemplateResult | null
   */
  _getAutocomplete(errorMessage: string | undefined): TemplateResult | null {
    return errorMessage
      ? null
      : html`
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/accessible-autocomplete@3.0.1/dist/accessible-autocomplete.min.css"
          />
          <label class=${this._getLabelClasses()} for=${this.id}>
            ${this.label}
          </label>
          <div id="${this.id}-container" spellcheck="false"></div>
        `;
  }

  render() {
    // handle various error states
    let errorMessage;
    if (!this.osApiKey && !this.osProxyEndpoint)
      errorMessage = "Missing OS Places API key or proxy endpoint";
    else if (this._osError) errorMessage = this._osError;
    else if (this._totalAddresses === 0)
      errorMessage = `No addresses found in postcode ${this.postcode}`;

    return html`
      ${this._getErrorMessageContainer(errorMessage)}
      ${this._getAutocomplete(errorMessage)}
    `;
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
    "address-autocomplete": AddressAutocomplete;
  }
}
