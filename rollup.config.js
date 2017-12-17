import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    external: ['axios'],
    plugins: [
      eslint({
        include: ["src/**"],
        throwOnError: true,
        throwOnWarning: true
      }),
      babel({ exclude: 'node_modules/**' })
    ]
  }
];
