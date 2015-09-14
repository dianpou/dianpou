var config = require('../config');
var auth = new $.RestClient(config.api.endpoint + '/auth/', {
  stringifyData: true,
  stripTrailingSlash: true
});

export var api = new $.RestClient(config.api.endpoint + '/admin/', {
  stringifyData: true,
  stripTrailingSlash: true,
  ajax:{
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', localStorage.session ? JSON.parse(localStorage.session).access_token : null);
    }
  }
});
export var Products            = api.add('products');
export var ProductPhotos       = Products.add('photos');
export var ProductStocks       = Products.add('stocks');
export var Session             = api.add('session');
export var Auth                = auth.add('access_token');
export var Categories          = api.add('categories');
export var Logistics           = api.add('logistics');
export var Payments            = api.add('payments');
export var Orders              = api.add('orders');
export var Refunds             = api.add('refunds');
export var Users               = api.add('users');
export var Admins              = api.add('admins');
export var Roles               = api.add('roles');
export var Files               = api.add('files');
export var Pages               = api.add('pages');
