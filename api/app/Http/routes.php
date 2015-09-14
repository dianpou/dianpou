<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

if (!function_exists('_apiRouteNames')) {
    function _apiRouteNames($resource_name, $namespace = '.admin')
    {
        return [
            'names' => [
                'index' => "api{$namespace}.{$resource_name}.index",
                'store' => "api{$namespace}.{$resource_name}.create",
                'show'  => "api{$namespace}.{$resource_name}.item",
            ]
        ];
    }
}

// Public
Route::resource('products', 'ProductController', array_merge(_apiRouteNames('product', null), [
    'only' => ['index', 'show']
]));
Route::get('/files/{file}', ['as'=>'api.file', 'uses'=>"FileController@index"])->where(['file'=>'(.*+)']);
Route::get('pages/{id}/assets/{file}', ['as'=>'api.page.assets', 'uses' => 'PageController@assets'])->where(['file'=>'(.*+)']);
Route::get('pages/{pathname}', ['as'=>"api.page.pathname", 'uses'=>'PageController@pathname'])->where(['pathname'=>'(.*+)']);
Route::get('pages', ['as'=>'api.page.index', 'uses'=>'PageController@index']);

Route::get('logistics', ['as' => 'api.logistics.index', 'uses' => 'LogisticsController@index']);
Route::post('logistics/{id}/calculator', ['as' => 'api.logistics.calculator', 'uses' => 'LogisticsController@calculator']);
Route::get('payments', ['as'=>'api.payment.index', 'uses'=>'PaymentController@index']);
Route::get('payments/{id}/logo', ['as'=>'api.payment.logo', 'uses'=>'PaymentController@logo']);

Route::get('cashier/purchase', ['as'=>'api.cashier.purchase', 'uses'=>'CashierController@purchase']);
Route::get('cashier/callback', ['as'=>'api.cashier.callback', 'uses'=>'CashierController@callback']);
Route::get('cashier/cancel', ['as'=>'api.cashier.cancel', 'uses'=>'CashierController@cancel']);

// Auth
Route::group(['namespace' => 'Auth', 'prefix' => 'auth'], function () {
    Route::post('access_token', ['as' => 'api.auth.access_token', 'uses' => 'AuthController@access_token']);
    Route::post('signin', ['as' => 'api.auth.signin', 'uses' => 'AuthController@signin']);
    Route::get('{provider}', 'AuthController@openid')->where(['provider'=>'(github|facebook|twitter|weibo)']);
    Route::get('{provider}/callback', 'AuthController@callback')->where(['provider'=>'(github|facebook|twitter|weibo)']);
});

// Sessioned
Route::group(['middleware' => ['oauth']], function () {
    Route::resource('bags', 'BagController', _apiRouteNames('bag', null));
    Route::get('session', 'SessionController@index');
});

// Signed in
Route::group(['middleware'=>['oauth', 'noguest']], function () {
    Route::get('session/stats', 'SessionController@stats');
    Route::get('profile', ['as'=>'api.profile', 'uses'=>'ProfileController@index']);
    Route::put('profile', 'ProfileController@update');
    Route::post('checkout', ['as' => 'api.checkout', 'uses' => 'CheckoutController@index']);

    Route::put('orders/{sn}/cancel', ['as' => 'api.order.cancel', 'uses' => 'OrderController@cancel'])->where(['sn'=>'([^\/]+)']);
    Route::put('orders/{sn}/refund', ['as'=> 'api.order.refund', 'uses' => 'OrderController@refund'])->where(['sn'=>'([^\/]+)']);
    Route::get('orders/{sn}/logs', ['as'=>'api.order.log.index', 'uses'=>'OrderLogController@index'])->where(['sn'=>'([^\/]+)']);
    Route::get('orders/{sn}', ['as' => 'api.order.item', 'uses' => 'OrderController@show'])->where(['sn'=>'([^\/]+)']);
    Route::put('orders/{sn}', 'OrderController@update')->where(['sn'=>'([^\/]+)']);
    Route::get('orders', ['as' => 'api.order.index', 'uses' => 'OrderController@index']);

    Route::put('refunds/{sn}/cancel', ['as' => 'api.refund.cancel', 'uses' => 'RefundController@cancel'])->where(['sn'=>'([^\/]+)']);
    Route::get('refunds/{sn}/logs', ['as'=>'api.refund.log.index', 'uses'=>'RefundLogController@index'])->where(['sn'=>'([^\/]+)']);
    Route::get('refunds/{sn}', ['as' => 'api.refund.item', 'uses' => 'RefundController@show'])->where(['sn'=>'([^\/]+)']);
    Route::get('refunds', ['as' => 'api.refund.index', 'uses' => 'RefundController@index']);

    Route::resource('addresses', 'AddressController', _apiRouteNames('address', null));
});

// Admin
Route::group(['prefix' => 'admin', 'namespace' => 'Admin', 'middleware' => ['oauth', 'admin.role']], function () {
    // Category
    Route::get('categories/tree', ['as' => 'api.admin.category.tree', 'uses' => 'CategoryController@tree']);
    Route::resource('categories', 'CategoryController', _apiRouteNames('category'));

    // Product
    Route::resource('products', 'ProductController', _apiRouteNames('product'));
    Route::resource('products.photos', 'ProductPhotoController', _apiRouteNames('product.photo'));
    Route::resource('products.stocks', 'ProductStockController', _apiRouteNames('product.stock'));

    Route::resource('files', 'UploadfileController', _apiRouteNames('file'));

    Route::get('logistics/deliverers', ['as' => 'api.admin.logistics.deliverers', 'uses' => 'LogisticsController@deliverers']);
    Route::post('logistics/{id}/calculator', ['as' => 'api.admin.logistics.calculator', 'uses' => 'LogisticsController@calculator']);
    Route::resource('logistics', 'LogisticsController', _apiRouteNames('logistics'));

    // Payment
    Route::get('payments/gateways', ['as' => 'api.admin.payment.gateways', 'uses' => 'PaymentController@gateways']);
    Route::resource('payments', 'PaymentController', _apiRouteNames('payment'));

    // Page
    // Route::get('pages/plugins', ['as' => 'api.admin.page.plugins', 'uses' => 'PageController@plugins']);
    Route::resource('pages', 'PageController', _apiRouteNames('page'));

    // Order
    Route::put('orders/{id}/cancel', ['as'=> 'api.admin.order.cancel', 'uses' => 'OrderController@cancel']);
    Route::put('orders/{id}/confirm', ['as'=> 'api.admin.order.confirm', 'uses' => 'OrderController@confirm']);
    Route::put('orders/{id}/pay', ['as'=> 'api.admin.order.pay', 'uses' => 'OrderController@pay']);
    Route::put('orders/{id}/ship', ['as'=> 'api.admin.order.ship', 'uses' => 'OrderController@ship']);
    Route::put('orders/{id}/refund', ['as'=> 'api.admin.order.refund', 'uses' => 'OrderController@refund']);
    Route::put('orders/{id}/complete', ['as'=> 'api.admin.order.complete', 'uses' => 'OrderController@complete']);
    Route::resource('orders', 'OrderController', _apiRouteNames('order'));
    Route::resource('orders.products', 'OrderProductController', _apiRouteNames('order.product'));
    Route::resource('orders.logs', 'OrderLogController', array_merge(_apiRouteNames('order.log'), ['only'=>['index']]));

    // Refund
    Route::put('refunds/{id}/cancel', ['as'=> 'api.admin.refund.cancel', 'uses' => 'RefundController@cancel']);
    Route::put('refunds/{id}/confirm', ['as'=> 'api.admin.refund.confirm', 'uses' => 'RefundController@confirm']);
    Route::put('refunds/{id}/returns', ['as'=> 'api.admin.refund.returns', 'uses' => 'RefundController@returns']);
    Route::put('refunds/{id}/pay', ['as'=> 'api.admin.refund.pay', 'uses' => 'RefundController@pay']);
    Route::put('refunds/{id}/complete', ['as'=> 'api.admin.refund.complete', 'uses' => 'RefundController@complete']);
    Route::resource('refunds', 'RefundController', array_merge(_apiRouteNames('refund'), [
        'except' => 'store',
    ]));
    Route::resource('refunds.products', 'RefundProductController', _apiRouteNames('refund.product'));
    Route::resource('refunds.logs', 'RefundLogController', _apiRouteNames('refund.log'));

    Route::resource('users', 'UserController', _apiRouteNames('user'));


    // Session
    Route::get('session', 'SessionController@index');

    // Region
    Route::resource('regions', 'RegionController');

    // // Deliverer
    // Route::get('deliverers/calculators', 'DelivererController@calculators');
    // Route::resource('deliverers', 'DelivererController');

    Route::resource('admins', 'AdminController');
    Route::resource('roles', 'AdminRoleController');
    Route::resource('bags', 'BagController');

    // Order
    // Route::resource('refunds', 'RefundController');
    // Route::resource('refunds.logs', 'RefundLogController');
    Route::resource('returns', 'ReturnController');
    Route::resource('returns.products', 'ReturnProductController');
    Route::resource('returns.logs', 'ReturnLogController');
    Route::get('test', 'TestController@test');
});
