var parse_filepath   = require('parse-filepath');
var DynamicLoader = {
  componentDidMount: function() {
    if (this.depends.length > 0) {
      var items = [];
      var loadDepend = (item, cb)=> {
        var file_info = parse_filepath(_.isString(item) ? item : item.url), tag;
        if (_.isString(item)) {
          item = {name: file_info.name, url:item};
        }

        if (_.last(file_info.extSegments) == '.js') {
          document.body.appendChild(this._createScriptTag.call(this, item, cb));
        } else {
          document.head.appendChild(this._createStyleTag.call(this, item));
          cb();
        };
      };
      var asyncLoad = _.isUndefined(this.dynamicAsyncLoad) ? true : this.dynamicAsyncLoad;
      if (asyncLoad) {
        async.each(this.depends, loadDepend, this.onAllLoaded || function(){});
      } else {
        async.eachSeries(this.depends, loadDepend, this.onAllLoaded || function(){});
      }
    };
  },
  componentWillUnmount: function() {
    $('[dynamicLoaded=true]').remove();
  },
  _createScriptTag: function(script, cb) {
    var tag  = document.createElement('script');
    tag.type = "text/javascript";
    tag.src  = script.url;
    tag.setAttribute('dynamicLoaded', "true");
    var onScriptLoaded = (script, evt) => {
      var scriptLoadedFunction = 'on' + _.capitalize(script.name) + 'Loaded';
      if (_.has(this, scriptLoadedFunction)) {
        this[scriptLoadedFunction].call(this, script);
      };
      console.log('Script ' + script.url + ' is loaded!');
      cb();
    };
    var onScriptError = (script, evt) => {
      var scriptLoadErrorFunction = 'on' + _.capitalize(script.name) + 'LoadError';
      if (_.has(this, scriptLoadErrorFunction)) {
        this[scriptLoadErrorFunction].call(this, script);
      };
      cb(evt);
      console.log('Script '  + script.url + ' can\'t  be loaded successfully, error: ' + evt);
    };
    tag.onload  = (this.onScriptLoaded ? this.onScriptLoaded : onScriptLoaded).bind(this, script);
    tag.onerror = (this.onScriptError  ? this.onScriptError  : onScriptError).bind(this, script);
    tag.async   = true;

    return tag;
  },
  _createStyleTag: function(style, cb) {
    var tag  = document.createElement('link');
    tag.type = "text/css";
    tag.rel  = 'stylesheet';
    tag.href = style.url;
    tag.setAttribute('dynamicLoaded', "true");

    return tag;
  }
};
module.exports = DynamicLoader;
