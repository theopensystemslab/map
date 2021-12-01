import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import accessibleAutocomplete from "accessible-autocomplete";

@customElement("address-search")
export class AddressSearch extends LitElement {
  @property({ type: String })
  localAuthority = "Southwark";

  @property({ type: String })
  osPlacesApiKey = import.meta.env.VITE_APP_OS_PLACES_API_KEY || "";

  firstUpdated() {
    // later fetch all addresses in Southwark, make list of their uniq postcodes
    const samples = ["SE5 0HU", "SE1 2QH", "HP9 2HA", "SW2 1EG"];

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
    "address-search": AddressSearch;
  }
}
