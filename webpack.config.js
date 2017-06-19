const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    bundle: [
      path.resolve(__dirname, './src/css/reset.css'),
      path.resolve(__dirname, './src/css/base.css'),
      path.resolve(__dirname, './src/index.js'),
    ],
  },
  output: {
    path: path.join(__dirname, './docs'),
    filename: '[name].js',
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?modules'
        })
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, './docs'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new ExtractTextPlugin('[name].css'),
  ],
};
