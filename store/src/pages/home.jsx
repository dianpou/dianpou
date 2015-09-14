import {Sidenav} from './components/layout';
import {lang} from 'lib/intl';
var update = React.addons.update;

export default class Home extends Sidenav {
  get initialState(){
    return {
      breadcrumb:{
        title:lang("home.name"),
        subtitle: "",
        paths:[],
      },
      stats:{},
      latest_orders:{
        loaded:false,
        items:[],
      }
    }
  }
  get menus(){
    return [
      {
        title:lang("home.dashboard"),
        items:[
          {text:lang("home.dashboard"), icon:"fa fa-home", href:"/home"},
          {text:lang("home.profile"), icon:"fa fa-pencil", href:"/home/profile"},
          {text:lang("home.addresses"), icon:"fa fa-book", href:"/home/addresses"},
        ]
      },
      {
        title:lang("home.dealing"),
        items:[
          {text:lang("home.orders"), icon:"fa fa-file-text-o", href:"/home/orders"},
          {text:lang("home.refunds"), icon:"fa fa-money", href:"/home/refunds"},
        ]
      },
    ];
  }
  get menu(){
    return this.state.menu || this.props.location.pathname;
  }
  componentWillMount(){
    this.breadcrumb();
    this.api.session.read('stats').done((stats)=>{
      this.setState({stats});
    }).error(this.handleError.bind(this));
    this.api.orders.read().done((items)=>{
      this.setState(update(this.state, {
        latest_orders:{
          items:{$set:items},
          loaded:{$set:true}
        }
      }));
    }).error(this.handleError.bind(this));

    return super.componentWillMount();
  }
  breadcrumb(breadcrumb = {}, menu = null){
    this.setState({menu: menu, breadcrumb:Object.assign(this.state.breadcrumb, breadcrumb)});
  }
  renderChildren(){
    if (this.props.children) {
      return super.renderChildren();
    } else {
      return this.getTemplate('home').call(this);
    }
  }
}
