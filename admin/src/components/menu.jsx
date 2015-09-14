var Link  = ReactRouter.Link, Menu,
    menus = require('../config/menus');

module.exports = Menu = React.createClass({
    mixins: [ReactRouter.State, ReactRouter.Navigation],
    unlistedRoute: {
      product_create: 'product_index',
      product_edit: 'product_index',
      'products.create': 'product_index',
      'products.edit': 'product_index',
      'categories.edit': 'categories',
      'categories.create': 'categories',
      'logistics.edit': 'logistics',
      'logistics.create': 'logistics',
      'payments.edit': 'payments',
      'payments.create': 'payments',
      'orders.create': 'orders',
      'orders.edit': 'orders',
      'orders.show': 'orders',
      'orders.index': 'orders',
      'orders.cancel': 'orders',
      'orders.confirm': 'orders',
      'orders.complete': 'orders',
    },

    active: function (items) {
      var menuKey;
      items.forEach((v)=>{
        if (v && this.refs[v]) {
          menuKey = v;
        }
      });
      menuKey = menuKey || this.unlistedRoute[_.first(items)];
      var actived = this.refs[menuKey];
      var $actived = $(React.findDOMNode(actived));
      var $root   = $(React.findDOMNode(this));
      $root.find('li.active').removeClass('active');
      if (actived.props.parent) {
        // 收起其他子菜单并打开当前子菜单
        this.toggleSubmenu(React.findDOMNode(this.refs[actived.props.parent]), true);
      } else {
        // 收起所有子菜单
        this.toggleSubmenu(actived, false);
      }
      $actived.addClass('active');
    },
    toggleSubmenu: function (current, toggle) {
      var $current = $(current);
      // 收起所有子菜单
      $current.siblings('li.treeview').find('ul.treeview-menu').slideUp('normal', function () {
        $(this).parent().removeClass('active');
        $(this).removeClass('menu-open');
      });
      if (toggle) {
        // 打开当前子菜单
        if ($current.hasClass('active')) {
          $current.find('ul.treeview-menu').slideUp('normal', function () {
            $(this).removeClass('menu-open');
            $current.removeClass('active');
          });
        } else {
          $current.addClass('active').find('ul.treeview-menu').slideDown('normal', function () {
            $(this).addClass('menu-open');
          });
        }
        try{
          $.AdminLTE.layout.fix();
        }catch(err) {}
      }
    },
    handleToggleSubmenu: function (menu, e) {
      e.preventDefault();
      this.toggleSubmenu(React.findDOMNode(this.refs[menu]), true);
    },

    render: function  () {
        return (
          <aside className="main-sidebar">
            <section className="sidebar">
              <ul className="sidebar-menu">
                <li className="header">NAVIGATION</li>
                {menus.map((item, i)=>{
                  if (_.isArray(item.children)) {
                    return (
                      <li key={i} className="treeview" ref={item.name}>
                        <a href="javascript:;" onClick={this.handleToggleSubmenu.bind(this, item.name)}><i className={item.icon}></i><span>{item.text}</span><i className="fa fa-angle-left pull-right"></i></a>
                        <ul className="treeview-menu">
                          {item.children.map((subitem, j)=>{
                            return (<li key={j} ref={subitem.name} parent={item.name}>
                                      <Link to={subitem.name} activeClassName="">
                                        <i className={subitem.icon}></i>
                                        {subitem.text}
                                      </Link>
                                    </li>);
                          }, this)}
                        </ul>
                      </li>
                    );
                  } else {
                    return (<li key={i} ref={item.name}>
                              <Link to={item.name} activeClassName="">
                                <i className={item.icon}></i>
                                <span>{item.text}</span>
                              </Link>
                            </li>);
                  }
                }, this)}
              </ul>
            </section>
          </aside>
        );
    }
});
