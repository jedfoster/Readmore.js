// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { version } from './package.json';

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

export default [{
  input: 'src/readmore.js',
  output: {
    file: 'dist/readmore.js',
    format: 'umd',
    name: 'Readmore',
    banner,
    sourcemap: true
  },
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' })
  ]
},
{
  input: 'src/readmore.js',
  output: {
    file: 'dist/readmore.es6.js',
    banner
  },
  plugins: [
    resolve()
  ]
}];
