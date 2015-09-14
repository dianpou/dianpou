import Page from './page';
import Image from 'lib/image';
import {lang, price, date} from 'lib/intl';

export default class Header extends Page {
  static defaultProps = {
    user: null,
    navs: [],
    bags: [],
  };
  openBag(){
    var $dom = $(React.findDOMNode(this)).find('#bag_button');
    $dom.dropdown('toggle');
  }
  render(){
    var {navs, user, bags, location, ...other} = this.props;
    return (
      <header className="main-header">
        <nav className="navbar navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <a href="/" className="navbar-brand"><b>Dian</b>pou</a>
            </div>
            <div className="collapse navbar-collapse pull-left" id="navbar-collapse">
              <ul className="nav navbar-nav">
                {navs.map((nav, i)=>{
                  return (
                    <li key={i} className={classNames({active:_.startsWith(this.context.router.state.location.pathname, '/' + nav.href)})}>
                      <a href={'/' + nav.href}>{nav.text}</a>
                    </li>
                  );
                })}
              </ul>
              {/*
              <form className="navbar-form navbar-left" role="search">
                <div className="form-group">
                  <input type="text" className="form-control" id="navbar-search-input" placeholder="Search" />
                </div>
              </form>
              */}
            </div>
            <div className="navbar-custom-menu">
              <ul className="nav navbar-nav">
                <li className="dropdown messages-menu">
                  <a href="#" className="dropdown-toggle" id="bag_button" data-toggle="dropdown">
                    <i className="ion-bag"></i>
                    {bags.length ? <span className="label label-success">{bags.length}</span> : null}
                  </a>
                  <ul className="dropdown-menu">
                    <li className="header">{lang('bag.item_count', {total:bags.length})}</li>
                    {bags.map((bag, i)=>{
                      return (
                        <li key={i}>
                          <ul className="menu">
                            <li>
                              <a href="#">
                                <div className="pull-left">
                                  <Image size={[36, 36]} src={_.get(bag, 'stock.cover.file.file_path')} />
                                </div>
                                <h4>
                                  {bag.product.product_name}
                                  <span className="pull-right">{bag.quantity}</span>
                                </h4>
                                <p>{bag.stock.option}</p>
                              </a>
                            </li>
                          </ul>
                        </li>
                      );
                    })}
                    <li className="footer"><a href="/bags">{lang('checkout.title')}</a></li>
                  </ul>
                </li>
                {!user.guest ? (
                  <li className={classNames("dropdown user user-menu",{active:this.context.router.isActive('/home')} )}>
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                      <img src={user.avatar} className="user-image" alt="User Image" />
                      <span className="hidden-xs">{user.name}</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="user-header">
                        <img src={user.avatar} className="img-circle" alt="User Image" />
                        <p>
                          {user.name}
                        </p>
                      </li>
                      <li className="user-body">
                        <div className="col-xs-6 text-center">
                          <Link to="/home">{lang('home.dashboard')}</Link>
                        </div>
                        <div className="col-xs-6 text-center">
                          <Link to="/home/orders">{lang('header.orders')}</Link>
                        </div>
                      </li>
                      <li className="user-footer">
                        <div className="pull-left">
                          <Link to="/home/profile" className="btn btn-default btn-flat">{lang('home.profile')}</Link>
                        </div>
                        <div className="pull-right">
                          <a href="/session/signout" className="btn btn-default btn-flat">{lang('signout')}</a>
                        </div>
                      </li>
                    </ul>
                  </li>
                ):(
                  <li>
                    <Link to="/session/signin">{lang('signin')}</Link>
                  </li>)
                }
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}
