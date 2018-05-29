const merge = require('webpack-merge');
const common = require('./webpack.common.js');
// still not working with webpack 4
// var DashboardPlugin = require('webpack-dashboard/plugin');
var path = require('path');

const config = merge(common, {
  mode: 'development',
  output: {
    filename: path.join('js', '[name].dev.js'),
    publicPath: 'http://localhost:8080/'
  },
  optimization: {
    // for dashboard plugin
    minimize: false
  },
  plugins: [
    //new DashboardPlugin({ port: 8080 })
  ],
  // eval should be fastest for dev but dashboard seems not to like it
  //devtool: 'eval' : 'nosources-source-map',
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 8080,
    compress: false,
    hot: true,
    inline: true,
    historyApiFallback: true,
    progress: true,
    stats: {
      children: false,
      modules: true,
      cached: true,
      colors: true,
      chunk: true
    }
  }
})

module.exports = config;

