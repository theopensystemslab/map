import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import accessibleAutocomplete from "accessible-autocomplete";

@customElement("postcode-search")
export class PostcodeSearch extends LitElement {
  @property({ type: String })
  localAuthority = "Southwark";

  firstUpdated() {
    // later fetch all addresses in Southwark, make list of their uniq postcodes
    const samples = ["SE5 0HU", "SE1 2QH", "HP9 2HA", "SW2 1EG"];

    // ref https://lit.dev/docs/components/shadow-dom/#accessing-nodes-in-the-shadow-dom
    accessibleAutocomplete({
      element: this.renderRoot.querySelector("#my-autocomplete-container"),
      id: "my-autocomplete", // match to <label>
      source: samples,
      autoselect: true,
      placeholder: "SE5 0HU",
    });
  }

  render() {
    return html`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/accessible-autocomplete@2.0.3/dist/accessible-autocomplete.min.css"
      />
      <label for="my-autocomplete"
        >Enter a postcode in ${this.localAuthority}</label
      >
      <div id="my-autocomplete-container"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "postcode-search": PostcodeSearch;
  }
}
