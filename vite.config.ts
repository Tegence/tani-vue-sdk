import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import path from "path";
import copy from "rollup-plugin-copy";
import esbuild from 'esbuild';

export default defineConfig({
  plugins: [
    vue(),
    dts(),
    copy({
      targets: [
        { src: "src/tani-vue-sdk.css", dest: "dist", rename: "styles.css" } // ✅ Copies CSS to dist/
      ],
      hook: "writeBundle"
    })
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


