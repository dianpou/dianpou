var path    = require('path');
var glob    = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var entries = glob.sync(__dirname + '/app/Plugins/**/Widgets/**/*.jsx');
entries = entries.map(function(item){
  var matches = item.match(/\/Plugins\/(\w+)\//);
  item = 'expose?Widgets.' + matches[1]+ '!' + item;
  return item;
});

module.exports = {
    devtool:'eval',
    context: __dirname,
    node: {
      __filename: true
    },
    entry: {
      js:entries,
      css:glob.sync(__dirname + '/app/Plugins/**/Widgets/**/*.less'),
    },
    output: {
      path: path.join(__dirname, 'public', 'assets', 'js'),
      filename: "widgets.js",
    },
    resolve:{
      extensions:['', '.js', '.json', '.jsx', '.jml', '.react.js'],
      modulesDirectories: ['bower_components', 'node_modules', './'],
    },
    module: {
        loaders: [
          { test: /\.(js|jsx|jml)$/,
            loaders: ['babel?stage=0'],
            exclude: /(node_modules|bower_components)/ },
          { test: /\.(png|jpg|gif)$/,
            loader: 'file-loader?name=../img/[name].[ext]' },
          { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=100000&minetype=application/font-woff" },
          { test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader?name=../fonts/[name].[ext]" },
          { test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader?name=../svg/[name].[ext]" },
          {
            test: /\.css$/, // Only .css files
            loader:  ExtractTextPlugin.extract('style-loader', 'css-loader') // Run both loaders
          },
          { test: /\.json$/, loader: "json-loader" },
          {
            test: /\.less$/, // Only .less files
            loader:  ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader') // Run both loaders
          }
        ]
    },
    plugins:[
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      // new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
      new ExtractTextPlugin("../css/widgets.css"),
      new webpack.ResolverPlugin([
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("package.json", ["main"]),
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]),
      ]),
    ],
};
