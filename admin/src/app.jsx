require('hacks/enhancement');

import {lang, date, price} from 'libraries/intl';
window.lang = lang;
window.date = date;
window.price = price;

import Dashboard from 'pages/dashboard';
import ProductForm from 'pages/product/form';
import {Page as BasePage} from './components/component';
import Category from 'pages/category';
import Logistics from 'pages/logistics';
import Payment  from 'pages/payment';
import Session from 'pages/session';
import Index from 'pages/index';
import Product from 'pages/product';
import Order from 'pages/order';
import Refund from 'pages/refund';
import User from 'pages/user';
import Admin from 'pages/admin';
import Role from 'pages/role';
import File from 'pages/file';
import Page from 'pages/page';


var {RouteHandler, Route, DefaultRoute} = ReactRouter;

// var App = React.createClass({
//     mixins: [ ReactRouter.Navigation, ReactRouter.State ],
//     render: function () {
//         return <RouteHandler />;
//     }
// });

class App extends BasePage {
  static get defaultProps(){
    return {
      locales:['zh-CN'],
      formats:{
        date: {
          "datetime": {
            year:"numeric",
            month:"long",
            day:"numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
          },
        },
        number:{
          cny:{
            style:'currency', currency:'CNY'
          },
          price:{
            style:'currency', currency:'CNY'
          }
        }
      },
      messages: window.Lang || {},
    }
  }
  render(){
    return <RouteHandler />;
  }
}

var routes = (
    <Route handler={App}>
        <Route name="session">
            <Route name="signin" handler={Session.Signin} />
            <Route name="signout" handler={Session.Signout} />
        </Route>
        <Route name="index" path="/" handler={Index}>
            <DefaultRoute name="dashboard" handler={Dashboard} />
            <Route name="products" >
                <DefaultRoute name="product_index" path="" handler={Product.Index} />
                <Route name="products.create" path="create" handler={ProductForm} />
                <Route name="products.edit" path=":id/edit" handler={ProductForm} />
            </Route>
            <Route name="orders">
                <DefaultRoute name="orders.index" handler={Order.Index} />
                <Route name="orders.show" path=":id" handler={Order.Show}>
                  <Route name="orders.edit" path="edit" handler={Order.Edit} />
                  <Route name="orders.cancel" path="cancel" handler={Order.Cancel} />
                  <Route name="orders.confirm" path="confirm" handler={Order.Confirm} />
                  <Route name="orders.pay" path="pay" handler={Order.Pay} />
                  <Route name="orders.ship" path="ship" handler={Order.Ship} />
                  <Route name="orders.refund" path="refund" handler={Order.Refund} />
                  <Route name="orders.complete" path="complete" handler={Order.Complete} />
                </Route>
                <Route name="orders.create" path="create" handler={Order.Form} />
            </Route>
            <Route name="refunds">
                <DefaultRoute name="refunds.index" handler={Refund.Index} />
                <Route name="refunds.show" path=":id" handler={Refund.Show}>
                  <Route name="refunds.edit" path="edit" handler={Refund.Edit} />
                  <Route name="refunds.cancel" path="cancel" handler={Refund.Cancel} />
                  <Route name="refunds.confirm" path="confirm" handler={Refund.Confirm} />
                  <Route name="refunds.pay" path="pay" handler={Refund.Pay} />
                  <Route name="refunds.complete" path="complete" handler={Refund.Complete} />
                </Route>
            </Route>
            <Route name="users" handler={User.Index}>
                <Route name="users.show" path=":id/edit" handler={User.Form} />
                <Route name="users.edit" path=":id/edit" handler={User.Form} />
                <Route path="create" name="users.create" handler={User.Form} />
            </Route>
            <Route name="files" handler={File.Index} />
            <Route name="pages" handler={Page.Index}>
              <Route path=":id/edit" name="pages.edit" handler={Page.Form} />
              <Route path="create" name="pages.create" handler={Page.Form} />
            </Route>
            <Route name="categories" handler={Category.Index}>
              <Route path=":id/edit" name="categories.edit" handler={Category.Form} />
              <Route path="create" name="categories.create" handler={Category.Form} />
            </Route>
            <Route name="logistics" handler={Logistics.Index}>
              <Route path=":id/edit" name="logistics.edit" handler={Logistics.Form} />
              <Route path="create" name="logistics.create" handler={Logistics.Form} />
            </Route>
            <Route name="payments" handler={Payment.Index}>
              <Route path=":id/edit" name="payments.edit" handler={Payment.Form} />
              <Route path="create" name="payments.create" handler={Payment.Form} />
            </Route>
            <Route name="admins" handler={Admin.Index}>
                <Route name="admins.edit" path=":id/edit" handler={Admin.Form} />
                <Route name="admins.create" path="create"  handler={Admin.Form} />
            </Route>
            <Route name="roles" handler={Role.Index}>
                <Route name="roles.edit" path=":id/edit" handler={Role.Form} />
                <Route name="roles.create" path="create"  handler={Role.Form} />
            </Route>
        </Route>
    </Route>
);


ReactRouter.run(routes, ReactRouter.HistoryLocation, (Handler)=>{
  React.render(<Handler />, document.body);
});
