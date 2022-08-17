import { defineConfig } from "vite";
import path from "path";
import litcss from 'rollup-plugin-postcss-lit';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "PlaceComponents",
      formats: ["es", "umd"],
      fileName: (format) => `place-components.${format}.js`,
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
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
