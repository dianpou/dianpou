<?php namespace App\Providers;

use Response;
use Illuminate\Support\ServiceProvider;

class DianpouServiceProvider extends ServiceProvider
{
    /**
    * Bootstrap the application services.
    */
    public function boot()
    {
        \DB::enableQueryLog();
        Response::macro('paginate', function ($finder, $per_page = 10) {
            $page = $finder->paginate($per_page)->toArray();

            return response($page['data'])
            ->header('X-Total-Count', $page['total'])
            ->header('Link', '<'.$page['next_page_url'].'>; rel="next", <'.$page['prev_page_url'].'>; rel="last"');
        });
        Response::macro('noContent', function ($resource) {
            return response(null, 204);
        });
        Response::macro('created', function ($resource) {
            return response($resource, 201);
        });
        Response::macro('updated', function ($resource) {
            return response($resource);
        });
        Response::macro('deleted', function () {
            return response(null, 204);
        });
    }

    public function register($value = '')
    {
        // $this->registerRequestRebindHandler();
    }
    /**
    * Register a resolver for the authenticated user.
    */
    protected function registerRequestRebindHandler()
    {
        // $this->app->rebinding('request', function($app, $request)
        // {
        //     $request->setUserResolver(function() use ($app, $request)
        //     {
        //         $grant_user = $request->headers->get('X-GRANT-USER');
        //         return $app['auth']->user()->$grant_user();
        //     });
        // });
    }
}
