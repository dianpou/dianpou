var WebpackDevServer = require('webpack-dev-server');
var webpack          = require('webpack');
var config           = require('./webpack.development');

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
  // webpack-dev-server options
  contentBase: __dirname + "/dist",
  // or: contentBase: "http://localhost/",

  hot: true,
  debug: true,
  // Enable special support for Hot Module Replacement
  // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
  // Use "webpack/hot/dev-server" as additional module in your entry point
  // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

  // webpack-dev-middleware options
  // quiet: false,
  // noInfo: false,
  // lazy: true,
  // filename: "app.js",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 100
  },
  publicPath: config.output.publicPath,
  progress:true,
  // headers: { "X-Custom-Header": "yes" },
  stats: { colors: true },

  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.
  historyApiFallback: true,

  // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
  // Use "*" to proxy all paths to the specified server.
  // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
  // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
  // proxy: {
  //   "*": "http://localhost:9090"
  // }
});
server.listen(4000, "127.0.0.1", function() {
  console.log('Dev server listening on 127.0.0.1:4000');
});
