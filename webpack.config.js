const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const banner = ` @preserve

Readmore.js plugin
Author: @jed_foster
Project home: jedfoster.com/Readmore.js
Version: ${pkg.version}
Licensed under the MIT license

Debounce function from davidwalsh.name/javascript-debounce-function`;

module.exports = {
  cache: true,
  entry: ['./src/readmore.js'],
  output: {
    path: path.join(__dirname, '/dist/'),
    library: 'Readmore',
    libraryExport: 'default',
    libraryTarget: 'window',
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
            options: {
              presets: ['env']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // Add banner to built code
    new webpack.BannerPlugin(banner)
  ]
};
