var path    = require('path');
var glob    = require('glob');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack_config = require('./webpack.production');

webpack_config.entry.app.splice(0, 0, 'webpack/hot/dev-server');
webpack_config.entry.app.splice(0, 0, 'webpack-dev-server/client?http://admin.dianpou.dev');

module.exports = webpack_config;
