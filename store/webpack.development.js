var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var glob    = require('glob');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpack_config = require('./webpack.production');

webpack_config.entry.app.splice(0, 0, 'webpack/hot/dev-server');
webpack_config.entry.app.splice(0, 0, 'webpack-dev-server/client?http://dianpou.dev');

module.exports = webpack_config;
