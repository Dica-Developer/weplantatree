const merge = require('webpack-merge');
const common = require('./webpack.common.js');
var path = require('path');

const config = merge(common, {
  mode: 'production',
  output: {
    filename: path.join('js', '[name].[hash].js'),
    publicPath: '/'
  },
  devtool: 'nosources-source-map',
})

module.exports = config;

