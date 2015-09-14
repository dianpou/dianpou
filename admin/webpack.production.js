var path    = require('path');
var glob    = require('glob');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool:'eval',
    context: __dirname,
    node: {
      __filename: true
    },
    entry: {
      app:[
        './src/styles/app.less',
        './src/app',
      ],
      lang:glob.sync(__dirname + '/lang/**/*.js'),
      vendor:[
        'script!es6-shim',
        'script!holderjs',
        'expose?$!expose?jQuery!jquery',
        'expose?_!lodash',
        'expose?moment!moment',
        'script!jquery.scrollTo/jquery.scrollTo.min.js',
        'expose?classNames!classnames',
        'expose?async!async',
        'expose?React!react/addons',
        'expose?ReactRouter!react-router',
        'expose?ReactBootstrap!react-bootstrap',
        'expose?Formsy!formsy-react',
        'expose?ReactSelect!react-select',
        'react-select/dist/default.css',
        'react-dropzone',
        'js-combinatorics',
        'expose?ReactIntl!react-intl',
        'react-notification-system',
        'expose?ReactWidgets!react-widgets',
        'react-widgets/dist/css/core.css',
        'react-widgets/dist/css/react-widgets.css',
        'expose?RadioGroup!react-radio-group',
        'jquery.rest/dist/1/jquery.rest.min.js',
        'ionicons/css/ionicons.min.css',
        'font-awesome/css/font-awesome.min.css',
        'bootstrap',
        'bootstrap/dist/css/bootstrap.min.css',
        'bootstrap-switch',
        'bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css',
        'script!bootstrap-daterangepicker/daterangepicker.js',
        'bootstrap-daterangepicker/daterangepicker.css',
        'expose?ReactTagsInput!react-tagsinput',
        'react-tagsinput/react-tagsinput.css',
        'expose?ReactToggle!react-toggle',
        'react-toggle/style.css',
        'expose?ReactDnD!react-dnd',
        'AdminLTE/dist/css/AdminLTE.min.css',
        'AdminLTE/dist/css/skins/skin-red-light.min.css',
        'expose?Chart!AdminLTE/plugins/chartjs/Chart.js',
        'fotorama/fotorama',
        'fotorama/fotorama.css',
        'src/hacks/adminlte.js',
      ]
    },
    output: {
      path: path.join(__dirname, 'dist', 'assets'),
      filename: "[name].js",
      publicPath: '/assets/',
    },
    externals:['plugins'],
    resolve:{
      alias: {
        'flux': path.join(__dirname, '/../node_modules/react-dnd/node_modules/dnd-core/node_modules/flummox/node_modules/flux')
      },
      extensions:['', '.js', '.json', '.jsx', '.jml', '.react.js'],
      modulesDirectories: ['bower_components', 'node_modules', './'],
    },
    module: {
        loaders: [
          { test: /\.(js|jsx|jml)$/,
            loaders: ['babel?stage=0'],
            exclude: /(node_modules|bower_components)/ },
          { test: /\.(png|jpg|gif)$/,
            loader: 'file-loader?name=img/[name].[ext]' },
          { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=100000&minetype=application/font-woff" },
          { test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader?name=fonts/[name].[ext]" },
          { test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader?name=svg/[name].[ext]" },
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        filename: '../index.html',
        template: __dirname + '/src/index.html',
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names:['lang', 'vendor']
      }),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
      new ExtractTextPlugin("css/[name].css"),
      new webpack.ResolverPlugin([
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("package.json", ["main"]),
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]),
      ]),
    ],
};
