import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import path from "path";
import esbuild from 'esbuild';
import copy from 'rollup-plugin-copy';
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    vue(),
    copy({
      targets: [{ src: 'src/style.css', dest: 'dist' }]
    }),
    dts(),
    cssInjectedByJsPlugin(),
  ],
  esbuild: {
    loader: "ts",
  },
  build: {
    lib: {
      entry: "src/index.ts", // ✅ Ensure correct path
      name: "TaniSDK",
      fileName: () => "index.js",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["vue"], // ✅ Prevent Vue from being bundled
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    cssCodeSplit: false,
  },
});


