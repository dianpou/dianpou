import config from 'config';

export var api = new $.RestClient(config.api.endpoint + '/', {
  stringifyData: true,
  stripTrailingSlash: true,
  ajax:{
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', localStorage.access_token || null);
    }
  }
});
export var Auth     = api.add('auth');
export var Session  = api.add('session');
export var Profile  = api.add('profile');
export var Products = api.add('products');
export var Addresses= api.add('addresses');
export var Bags     = api.add('bags');
export var Payments = api.add('payments');
export var Cashier  = api.add('cashier', {stripTrailingSlash: true});
export var Logistics= api.add('logistics');
export var Checkout = api.add('checkout');
export var Orders   = api.add('orders');
export var Refunds  = api.add('refunds');
export var Pages    = api.add('pages');
