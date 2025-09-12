import { html, LitElement, TemplateResult, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import accessibleAutocomplete from "accessible-autocomplete";

import styles from "./styles.scss?inline";
import { getServiceURL } from "../../lib/ordnanceSurvey";

// https://docs.os.uk/os-apis/accessing-os-apis/os-places-api/technical-specification/find
type Address = {
  LPI: {
    ADDRESS: string;
    LAT: number;
    LNG: number;
    MATCH: number;
  };
};

type LabelStyleEnum = "responsive" | "static";

function debounce(
  fn: (...args: any[]) => void | Promise<void>,
  delay: number,
): (...args: any[]) => void {
  let timer: NodeJS.Timeout | null = null;
  let isFirstCall = true;
  return function (this: any, ...args: any[]) {
    if (isFirstCall) {
      fn.apply(this, args);
      isFirstCall = false;
      return;
    }

    if (timer) clearTimeout(timer as NodeJS.Timeout);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

@customElement("geocode-autocomplete")
export class GeocodeAutocomplete extends LitElement {
  // ref https://github.com/e111077/vite-lit-element-ts-sass/issues/3
  static styles = unsafeCSS(styles);

  @property({ type: String })
  id = "geocode";

  @property({ type: String })
  label = "Search for an address";

  @property({ type: String })
  initialAddress = "";

  @property({ type: String })
  osApiKey = "";

  @property({ type: String })
  osProxyEndpoint = "";

  @property({ type: String })
  labelStyle: LabelStyleEnum = "responsive";

  // internal reactive state
  @state()
  private _selectedAddress: Address | null = null;

  @state()
  private _addressesMatching: Address[] = [];

  @state()
  private _isLoading: boolean = false;

  @state()
  private _osError: string | undefined = undefined;

  // called when DOM node is connected to the document, before render
  connectedCallback() {
    super.connectedCallback();
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
      source: debounce((query: string, populateResults: any) => {
        this._isLoading = true;

        // min query length of 3 before fetching
        if (query.length >= 3) {
          this._fetchData(query, populateResults);

          this._isLoading = false;
        }
      }, 500),
      defaultValue: this.initialAddress,
      showAllValues: true,
      displayMenu: "overlay",
      minLength: 3,
      tNoResults: () => (this._isLoading ? `Loading...` : `No results found`),
      tStatusQueryTooShort: (minQueryLength: number) =>
        `Type at least ${minQueryLength} characters for search results`,
      onConfirm: (option: string) => {
        this._selectedAddress = this._addressesMatching.filter(
          (address) => address.LPI.ADDRESS === option,
        )[0];
        if (this._selectedAddress)
          this.dispatch("addressSelection", { address: this._selectedAddress });
      },
    });
  }

  async _fetchData(
    input: string = "",
    populateResults: (values: string[]) => void,
  ) {
    const isUsingOS = Boolean(this.osApiKey || this.osProxyEndpoint);
    if (!isUsingOS)
      throw Error("OS Places API key or OS proxy endpoint not found");

    // https://docs.os.uk/os-apis/accessing-os-apis/os-places-api/technical-specification/find
    const params: Record<string, string> = {
      query: input,
      dataset: "LPI",
      maxresults: "100",
      lr: "EN",
      output_srs: "EPSG:4326",
      fq: "LPI_LOGICAL_STATUS_CODE:1",
    };

    const url = getServiceURL({
      service: "find",
      apiKey: this.osApiKey,
      proxyEndpoint: this.osProxyEndpoint,
      params,
    });

    await fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        // reset options on every fetch
        populateResults([]);

        // handle error formats returned by OS
        if (data.error || data.fault) {
          this._osError =
            data.error?.message ||
            data.fault?.faultstring ||
            "Something went wrong";
        }

        if (data.results) {
          // sort by LPI.MATCH, then numeric
          const collator = new Intl.Collator([], { numeric: true });
          const sortedAddresses = data.results.sort(
            (a: Address, b: Address) => {
              if (a.LPI.MATCH !== b.LPI.MATCH) {
                return b.LPI.MATCH - a.LPI.MATCH;
              }
              return collator.compare(a.LPI.ADDRESS, b.LPI.ADDRESS);
            },
          );

          this._addressesMatching = sortedAddresses;

          let options = sortedAddresses.map(
            (address: Address) => address.LPI.ADDRESS,
          );

          populateResults(options);
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
    "geocode-autocomplete": GeocodeAutocomplete;
  }
}
