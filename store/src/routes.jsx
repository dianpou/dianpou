import {Router as ReactRouter, Route, DefaultRoute, Link} from 'react-router';
import {history} from 'react-router/lib/BrowserHistory';
// import {history} from 'react-router/lib/HashHistory';
import {formatPattern} from 'react-router/lib/URLUtils';
import * as Pages from './pages';
import config from './config';

class Router extends ReactRouter {
  static get childContextTypes(){
    return Object.assign(super.childContextTypes, {
      locales: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.array
      ]),
      formats : React.PropTypes.object,
      messages: React.PropTypes.object
    });
  }
  getChildContext(){
    var context = super.getChildContext() || {};
    var intl    = this.props.intl || {};
    context.locales = intl.locales || ['zh-CN'];
    context.formats = intl.formats || {};
    context.messages= intl.messages|| {};

    return context;
  }
}

window.Link = class extends React.Component {
  static get contextTypes(){
    return {
      router:React.PropTypes.object.isRequired
    };
  }
  url(name, params, parentPath = '', routes = null) {
    routes = routes ? routes : this.context.router.routes;
    for (let i = 0; i < routes.length; i++) {
      let route = routes[i];
      let currentPath = parentPath + (route.path || '/');

      if (name == route.name) {
        return formatPattern(currentPath, params);
      };

      if (route.childRoutes) {
        let url = this.url(name, params, currentPath, route.childRoutes);
        if (url) {
          return url;
        }
      }
    };
    if (!parentPath) {
      return name;
    }
  }
  render(){
    var {to, params, ...other} = this.props;
    to = this.url(to, params);

    return <Link to={to} {...other} />
  }
}


export default (
  <Router history={history} intl={config.intl}>
    <Route component={Pages.Initial} onEnter={Pages.Session.init}>
      <Route path="session">
        <Route path="/signin" name="signin" component={Pages.Session.Signin} />
        <Route path="/signup" name="signup" component={Pages.Session.Signin} />
        <Route path="/openid" component={Pages.Session.Openid} />
        <Route path="/signout" name="signout" onEnter={Pages.Session.signout} />
      </Route>
      <Route onEnter={Pages.Session.Signin.signedInRequired}>
        <Route path="checkout" name="checkout" component={Pages.Checkout}>
          <Route path="consignee" name="consignee" component={Pages.Address.Form} />
        </Route>
        <Route path="home" name="home" component={Pages.Home}>
          <Route path="profile" component={Pages.Profile} />
          <Route path="addresses" component={Pages.Address.Index}>
            <Route path="create" component={Pages.Address.Form} />
            <Route path=":id" component={Pages.Address.Form} />
          </Route>
          <Route path="orders" component={Pages.Order.Index} />
          <Route path="orders/:sn" component={Pages.Order.Show}>
            <Route path="cancel" component={Pages.Order.Cancel} />
          </Route>
          <Route path="refunds" component={Pages.Refund.Index} />
          <Route path="refunds/:sn" component={Pages.Refund.Show}>
            <Route path="cancel" component={Pages.Refund.Cancel} />
          </Route>
        </Route>
      </Route>
      <Route path='products/:id' name="product" component={Pages.Product} />
      <Route path='about' name="test" component={Pages.About} />
      <Route path='bags' name="bags" component={Pages.Bag} />
      <Route path='*' onEnter={Pages.WidgetPage.loadWidgets} component={Pages.WidgetPage} />
    </Route>
  </Router>
);
