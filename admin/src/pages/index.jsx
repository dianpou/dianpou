var Header       = require('../components/header'),
    Menu         = require('../components/menu'),
    Footer       = require('../components/footer'),
    ControlSidebar = require('../components/control-side-bar');

var {RouteHandler} = ReactRouter;
import {Page, AuthedPage} from '../components/component';
import {Session} from '../libraries/api';

class Index extends Page {
  static willTransitionTo(transition, params, query, cb){
    // setTimeout(cb, 2000);
    this.handler.loadUser().then((user)=>{
      window.user = user;
      cb();
    }).catch((e)=>{
      console.error(e);
      transition.redirect('signin');
      cb();
    });
  }
  static loadUser(){
    return new Promise((resolve, reject)=>{
      try {
        var access_token = JSON.parse(localStorage.session).access_token;
        if (access_token) {
          Session.read({access_token}).done((data, status, xhr)=>{
            resolve(data);
          }).error(reject);
        }
      } catch (e) { reject(e);}
    });
  }
  componentDidMount() {
    // 变更菜单状态
    var actived = _.pluck(this.context.router.getCurrentRoutes(), 'name');
    this.refs.menu.active(_(actived).reverse().value());
    // AdminLTE自动重新计算页面高度。
    try{
      this.layoutFix();
    }catch(err){}
  }
  layoutFix() {
    $.AdminLTE.layout.fix();
    $.AdminLTE.layout.fixSidebar();
  }

  componentDidUpdate() {
    // 变更菜单状态
    var actived = _.pluck(this.context.router.getCurrentRoutes(), 'name');
    this.refs.menu.active(_(actived).reverse().value());

    // AdminLTE自动重新计算页面高度。
    this.layoutFix();
  }

  render(){
    return (
      <div className="wrapper">
        <Header user={window.user} />
        <Menu ref="menu" />
        <RouteHandler />
        <Footer />
        <ControlSidebar />
      </div>
    );
  }
}

export default Index;
