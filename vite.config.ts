import { defineConfig } from "vite";
import litcss from 'rollup-plugin-postcss-lit';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "my-map": "src/my-map.ts",
        "address-autocomplete": "src/components/address-autocomplete/index.ts",
        "postcode-search": "src/components/postcode-search/index.ts",
      },
      output: [
        {
          entryFileNames: ({ name }) => `${name}.es.js`,
          format: "es",
          inlineDynamicImports: false,
        },
        {
          entryFileNames: ({ name }) => `${name}.umd.js`,
          format: "umd",
          inlineDynamicImports: true,
        },
      ],
    },
  },
  plugins: [
    // @ts-ignore
    {
      ...litcss(),
      enforce: 'post'
    }
  ],
});
