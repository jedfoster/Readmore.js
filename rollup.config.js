// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default [{
  input: 'src/readmore.js',
  output: {
    file: 'dist/readmore.js',
    format: 'umd',
    name: 'Readmore'
  },
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' })
  ]
},
{
  input: 'src/readmore.js',
  output: {
    file: 'dist/readmore.es6.js'
  },
  plugins: [
    resolve()
  ]
}];
