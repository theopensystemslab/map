// Helper method to access the shadow root of a custom element
export function getShadowRoot(customEl: string): ShadowRoot | null | undefined {
  return document.body.querySelector(customEl)?.shadowRoot;
}

// Helper method to access a specific HTML element within the shadow root of a custom element
export function getShadowRootEl(
  customEl: string,
  el: string
): Element | null | undefined {
  return document.body.querySelector(customEl)?.shadowRoot?.querySelector(el);
}

module.exports = {
  getShadowRoot,
  getShadowRootEl,
};
