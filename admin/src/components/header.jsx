var {Link} = ReactRouter;
import {Page, AuthedPage} from './component';

export default class Index extends Page {
  render() {
    var user = this.props.user || {};
    return (
      <header className="main-header">
        <a href="/" className="logo">
          <span className="logo-mini"><b>D</b>P</span>
          <span className="logo-lg"><b>Dian</b>pou</span>
        </a>
        <nav className="navbar navbar-static-top" role="navigation">
          <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span className="sr-only">Toggle navigation</span>
          </a>
          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li className="dropdown user user-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <img src={user.avatar} className="user-image" alt="User Image"/>
                  <span className="hidden-xs">{user.name}</span>
                </a>
                <ul className="dropdown-menu">
                  <li className="user-header">
                    <img src={user.avatar} className="img-circle" alt="User Image" />
                    <p>
                      {user.name}
                      <small></small>
                    </p>
                  </li>
                  <li className="user-footer">
                    <div className="pull-left">
                      <a href="#" className="btn btn-default btn-flat">{lang('profile')}</a>
                    </div>
                    <div className="pull-right">
                      <Link to="signout" className="btn btn-default btn-flat">{lang('signout')}</Link>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      );
  }
}
