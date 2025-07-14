/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";
import litcss from "rollup-plugin-postcss-lit";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ComponentLib",
      formats: ["es", "umd"],
      fileName: (format) => `component-lib.${format}.js`,
    },
    rollupOptions: {
      // external: /^lit-element/,
      // input: {
      //   main: resolve(__dirname, "index.html"),
      // },
    },
  },
  plugins: [
    // @ts-ignore
    {
      ...litcss(),
      enforce: "post",
    },
  ],
  // https://vitest.dev/config/#options
  test: {
    globals: true,
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "govuk-frontend": path.resolve(
        __dirname,
        "./node_modules/govuk-frontend",
      ),
    },
  },
});
