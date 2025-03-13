import vue from '@vitejs/plugin-vue';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import css from 'rollup-plugin-import-css';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/tani-sdk.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/tani-sdk.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
        vue(), 
        resolve({ extensions: [".mjs", ".js", ".ts", ".json", ".vue"] }), 
        commonjs(), 
        typescript({ tsconfig: "./tsconfig.json" }), 
        css()
    ],
    external: ['vue'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: "dist/tani-sdk.d.ts", format: "es" }],
    plugins: [dts()],
  },
];