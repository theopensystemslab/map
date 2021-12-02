import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import accessibleAutocomplete from "accessible-autocomplete";

@customElement("address-autocomplete")
export class AddressAutocomplete extends LitElement {
  @property({ type: String })
  postcode = "";

  @property({ type: String })
  osPlacesApiKey = import.meta.env.VITE_APP_OS_PLACES_API_KEY || "";

  firstUpdated() {
    // todo fetch all addresses in some postcode from OS Places /postcode endpoint (or /polygon if you pass a prop other than postcode??)
    const samples = ["47 Cobourg Road", "49 Cobourg Road"];

    // ref https://lit.dev/docs/components/shadow-dom/#accessing-nodes-in-the-shadow-dom
    accessibleAutocomplete({
      element: this.renderRoot.querySelector("#my-autocomplete-container"),
      id: "my-autocomplete", // match to <label>
      source: samples,
      autoselect: true,
      placeholder: "Select the address",
    });
  }

  render() {
    return html`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/accessible-autocomplete@2.0.3/dist/accessible-autocomplete.min.css"
      />
      <label for="my-autocomplete">Find the property</label>
      <div id="my-autocomplete-container"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "address-autocomplete": AddressAutocomplete;
  }
}
