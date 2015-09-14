import ReactIntl from 'react-intl';
import {formatPattern} from 'react-router/lib/URLUtils';
import {api} from 'lib/api';

export default React.createClass({
  contextTypes: {
      router: React.PropTypes.object.isRequired
  },
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
  api: api,
  // n(v, format = 'price'){
  //   return this.formatNumber(v, format);
  // },
  // t(msg, props, ns){
  //   ns = ns === false ? ns : this.langNS;
  //   try { var msg = this.getIntlMessage(_.filter([ns, msg]).join('.')); } catch (e) { }
  //
  //   return this.formatMessage(msg, props);
  // },
  // d(v, format = 'YYYY/MM/DD HH:mm:ss'){
  //   return v ? moment.utc(v).utcOffset('+08:00').format(format) : null;
  // },
  // url(name, params, parentPath = '', routes = null) {
  //   routes = routes ? routes : this.context.router.routes;
  //   for (let i = 0; i < routes.length; i++) {
  //     let route = routes[i];
  //     let currentPath = parentPath + (route.path || '/');
  //
  //     if (name == route.name) {
  //       return formatPattern(currentPath, params);
  //     };
  //
  //     if (route.childRoutes) {
  //       let url = this.url(name, params, currentPath, route.childRoutes);
  //       if (url) {
  //         return url;
  //       }
  //     }
  //   };
  //   if (!parentPath) {
  //     console.error(`Can't find route with name ${name}`);
  //   }
  // },
  getInitialState(){
    return this.initialState;
  },
  initialState:{},
  render(){ return; },
});
