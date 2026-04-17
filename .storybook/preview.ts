import type { Preview } from "@storybook/web-components";

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        // Strip the arrow function wrapper so the code panel shows clean HTML
        // e.g. `() => \`<my-map zoom="18">\`` → `<my-map zoom="18">`
        transform: (src: string) => {
          // The CSF plugin injects the full story object as source, e.g.:
          //   { name: "...", render: () => `<my-map ...></my-map>` }
          // Extract the template literal content from the render function.
          const match = src.match(/render:\s*\(\)\s*=>\s*`([\s\S]*)`/);
          return match ? match[1].trim() : src;
        },
      },
    },
  },
};

export default preview;
