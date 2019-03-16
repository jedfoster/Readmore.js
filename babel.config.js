const constants = require('./constants.js');

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: [
          'last 2 versions',
          '> 0.25%',
          'maintained node versions',
          'not dead'
        ],
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: [
    ['transform-define', constants],
    '@babel/plugin-transform-runtime'
  ]
};
