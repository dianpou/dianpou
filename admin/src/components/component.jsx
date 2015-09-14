import parse_filepath from 'parse-filepath';
import {Session} from '../libraries/api';

export var Component = React.createClass({
  mixins:[ReactIntl.IntlMixin, React.addons.LinkedStateMixin, {
    linkStateDeep: function (k) {
        return {
            value: _.get(this.state, k),
            requestChange: (v) => {
                this.setState(_.set(this.state, k, v));
            }
        };
    }
  }],
  render(){ return; }
});

/**
 * Base RouterComponent
 */
export class Page extends Component {
  static get contextTypes(){
    return Object.assign({
      router: React.PropTypes.func.isRequired
    }, super.contextTypes || {});
  }
  static get childContextTypes(){
    return Object.assign({
      parent: React.PropTypes.object.isRequired
    }, super.childContextTypes || {});
  }
  get model(){
    return {
      routeName:'',
      routeAlias: '',
      api:{},
    }
  }
  get langNS(){
    return;
  }
  t(msg, props, ns){
    ns = ns === false ? ns : this.langNS;
    try { var msg = this.getIntlMessage(_.filter([ns, msg]).join('.')); } catch (e) { }

    return this.formatMessage(msg, props);
  }
  n(v, format = 'price'){
    return this.formatNumber(v, format);
  }
  d(v, format = 'YYYY/MM/DD HH:mm:ss'){
    return v ? moment.utc(v).utcOffset('+08:00').format(format) : null;
  }
  getChildContext(){
    return Object.assign({
      parent:this
    }, super.getChildContext() || {});
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    if (this.externalAssets.length > 0) {
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
        async.each(this.externalAssets, loadDepend, this.onAllLoaded || function(){});
      } else {
        async.eachSeries(this.externalAssets, loadDepend, this.onAllLoaded || function(){});
      }
    };
  }
  componentWillUnmount() {
    $('[dynamicLoaded=true]').remove();
  }
  _createScriptTag(script, cb) {
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
  }
  _createStyleTag(style, cb) {
    var tag  = document.createElement('link');
    tag.type = "text/css";
    tag.rel  = 'stylesheet';
    tag.href = style.url;
    tag.setAttribute('dynamicLoaded', "true");

    return tag;
  }
  get externalAssets(){
    return [];
  }
  get currentRoute(){
    return _.last(this.context.router.getCurrentRoutes());
  }
}
