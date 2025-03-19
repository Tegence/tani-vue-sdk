import vue from 'rollup-plugin-vue'; 
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
      vue({ 
        include: /\.vue$/,
        isProduction: false,
        preprocessStyles: true,
      }), 
      resolve({ extensions: [".mjs", ".js", ".ts", ".json", ".vue"] }), 
      commonjs(), 
      typescript({ 
        tsconfig: './tsconfig.json',
        sourceMap: false,
        declaration: true,
        declarationDir: 'dist/types',
      }), 
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