<?php namespace App\Http\Middleware;

use Closure;
use App\Models\Admin;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Libraries\OAuth\Guest;

class NoGuestMiddleware {


    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!$request->user) {
            throw new AccessDeniedHttpException('Permisson denied');
        }
        if ($request->user instanceof Guest) {
            throw new AccessDeniedHttpException('Permisson denied');
        }

        return $next($request);
    }

}
