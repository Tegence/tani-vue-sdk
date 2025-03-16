
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: "src/index.ts", // ✅ Must exist!
      name: "TaniSDK",
      fileName: (format) => `tani-sdk.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"], // ✅ Prevent Vue from being bundled
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});

