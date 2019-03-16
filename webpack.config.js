const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const pkg = require('./package.json');
const constants = require('./constants.js');

const banner = ` @preserve

Readmore.js plugin
Author: @jed_foster
Project home: jedfoster.com/Readmore.js
Version: ${pkg.version}
Licensed under the MIT license

Debounce function from davidwalsh.name/javascript-debounce-function`;

const transform = (content) => {
  let txt = `/*!
 *${banner.split('\n').join('\n * ')}
 */
${content.toString()}`;

  Object.keys(constants).forEach((key) => {
    txt = txt.toString().replace(key, `'${constants[key]}'`);
  });

  return Buffer.from(txt);
};

module.exports = {
  mode: 'development',
  cache: true,
  entry: ['./src/readmore.js'],
  output: {
    path: path.join(__dirname, '/dist/'),
    library: 'Readmore',
    libraryExport: 'default',
    // libraryTarget: 'window',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: 'readmore.js'
  },
  devServer: {
    contentBase: path.join(__dirname, '/src/'),
    // compress: true,
    port: process.env.PORT || 9000,
    watchContentBase: true,
    allowedHosts: [
      'macbookpro.local',
      'localhost'
    ],
    host: '0.0.0.0'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] }
          }
        ]
      }
    ]
  },
  plugins: [
    // Add banner to built code
    new webpack.BannerPlugin(banner),
    new CopyPlugin([
      {
        from: 'src/readmore.js',
        to: 'readmore.es6.js',
        transform
      }
    ])
  ]
};
