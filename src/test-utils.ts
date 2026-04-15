// Helper method to access the shadow root of a custom element
export function getShadowRoot(customEl: string): ShadowRoot | null | undefined {
  return document.body.querySelector(customEl)?.shadowRoot;
}

// Helper method to access a specific HTML element within the shadow root of a custom element
export function getShadowRootEl(
  customEl: string,
  el: string,
): Element | null | undefined {
  return document.body.querySelector(customEl)?.shadowRoot?.querySelector(el);
}

export async function waitForElement(customEl: string): Promise<void> {
  const el = document.body.querySelector(customEl) as any;
  await el?.updateComplete;
}

export async function setupMap(mapElement: any) {
  document.body.innerHTML = mapElement;
  await waitForElement("my-map");
  window.olMap?.dispatchEvent("loadend");
}
