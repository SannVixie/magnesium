var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "ui-control", "src"),
  entry: "./index.jsx",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [
            'react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'
          ],
          presets: ['react', 'es2015', 'stage-0']
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, "ui-control"),
    filename: "index.min.js"
  },
  plugins: debug
    ? []
    : [new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false})],

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'inline-sourcemap',
  target: "electron"
};
