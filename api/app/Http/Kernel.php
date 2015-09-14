<?php namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel {

    /**
     * The application's global HTTP middleware stack.
     *
     * @var array
     */
    protected $middleware = [
        'Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode',
        'Illuminate\Cookie\Middleware\EncryptCookies',
        'Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse',
        'Illuminate\Session\Middleware\StartSession',
        'Illuminate\View\Middleware\ShareErrorsFromSession',
        'LucaDegasperi\OAuth2Server\Middleware\OAuthExceptionHandlerMiddleware',
        'Barryvdh\Cors\Middleware\HandleCors',
        'App\Http\Middleware\APIExceptionHandlerMiddleware',
    ];

    /**
     * The application's route middleware.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'auth' => 'App\Http\Middleware\Authenticate',
        'auth.basic' => 'Illuminate\Auth\Middleware\AuthenticateWithBasicAuth',
        'guest' => 'App\Http\Middleware\RedirectIfAuthenticated',
        'csrf' => 'App\Http\Middleware\VerifyCsrfToken',
        'api.exception.handler' => 'App\Http\Middleware\APIExceptionHandlerMiddleware',
        'oauth' => 'App\Http\Middleware\OAuthMiddleware',
        'oauth.check_auth_code' => 'App\Http\Middleware\OAuthCheckAuthCodeMiddleware',
        'admin.role' => 'App\Http\Middleware\AdminRoleMiddleware',
        'noguest' => 'App\Http\Middleware\NoGuestMiddleware',
    ];

}
