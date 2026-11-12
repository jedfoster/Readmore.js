import replace from '@rollup/plugin-replace';
import { createRequire } from 'node:module';

const { version } = createRequire(import.meta.url)('./package.json');

const banner = `/*!
 * @preserve
 *
 * Readmore.js plugin
 * Author: Jed Foster
 * Project home: jedfoster.com/Readmore.js
 * Version: ${version}
 * Source: github.com/jedfoster/Readmore.js
 * Licensed under the MIT license
 *
 * Debounce function from davidwalsh.name/javascript-debounce-function
 */
`;

const plugins = [
  replace({
    preventAssignment: true,
    values: { __VERSION__: JSON.stringify(version) },
  }),
];

export default [
  {
    input: 'src/readmore.js',
    output: {
      file: 'dist/readmore.js',
      format: 'umd',
      name: 'Readmore',
      banner,
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'src/readmore.js',
    output: {
      file: 'dist/readmore.es6.js',
      format: 'es',
      banner,
    },
    plugins,
  },
];
