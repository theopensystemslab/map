import { defineConfig } from "vite";
import litcss from 'rollup-plugin-postcss-lit';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/my-map.ts",
      formats: ["es", "umd"],
      name: "map",
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
});
