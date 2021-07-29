import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/my-map.ts",
      formats: ["es"],
    },
    rollupOptions: {
      // external: /^lit-element/,
      // input: {
      //   main: resolve(__dirname, "index.html"),
      // },
    },
  },
});
