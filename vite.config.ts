/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";
import litcss from 'rollup-plugin-postcss-lit';

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
      enforce: 'post'
    }
  ],
  // https://vitest.dev/config/#options
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  // https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#silence-deprecation-warnings-from-dependencies-in-dart-sass
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true
      }
    }
  }
});
