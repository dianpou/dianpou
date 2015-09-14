import {lang, date, price} from 'libraries/intl';

module.exports = [
    {
      name: 'dashboard',
      icon: 'fa fa-dashboard',
      text: lang('menu.index')
    },
    {
      name: 'goods',
      icon: 'fa fa-tags',
      text: lang('menu.product'),
      children: [
          {
            name: 'product_index',
            icon: 'fa fa-tags',
            text: lang('menu.product_index')
          },
          {
            name: 'categories',
            icon: 'fa fa-navicon',
            text: lang('menu.product_category')
          }
        ]
    },
    {
      name: 'trade',
      icon: 'fa fa-shopping-cart',
      text: lang('menu.transaction'),
      children: [
          {
            name: 'orders',
            icon: 'fa fa-shopping-cart',
            text: lang('menu.order')
          },
          {
            name: 'refunds',
            icon: 'fa fa-money',
            text: lang('menu.refund')
          },
          {
            name: 'logistics',
            icon: 'fa fa-ship',
            text: lang('menu.logistics')
          },
          {
            name: 'payments',
            icon: 'fa fa-credit-card',
            text: lang('menu.payment')
          },
        ]
    },
    {
      name: 'cms',
      icon: 'fa fa-file-o',
      text: lang('menu.cms'),
      children: [
          {
            name: 'files',
            icon: 'fa fa-file-o',
            text: lang('menu.file')
          },
          {
            name: 'pages',
            icon: 'fa fa-file-text-o',
            text: lang('menu.page')
          }
        ]
    },
    {
      name: 'system',
      icon: 'fa fa-gear',
      text: lang('menu.system'),
      children: [
            {
              name: 'admins',
              icon: 'fa fa-user-secret',
              text: lang('menu.admin')
            },
            {
              name: 'roles',
              icon: 'fa fa-group',
              text: lang('menu.role')
            },
            {
              name: 'users',
              icon: 'fa fa-user',
              text: lang('menu.user')
            },
        ]
    }
];
