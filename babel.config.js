const constants = require('./constants.js');

module.exports = {
  presets: [['@babel/env']],
  plugins: [['transform-define', constants]]
};
