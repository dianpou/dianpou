<?php namespace App\Http\Middleware;

use Closure;
use LucaDegasperi\OAuth2Server\Authorizer;

class OAuthCheckAuthCodeMiddleware {

    /**
     * The authorizer instance
     * @var \LucaDegasperi\OAuth2Server\Authorizer
     */
    protected $authorizer;

    /**
     * @param Authorizer $authorizer
     */
    public function __construct(Authorizer $authorizer)
    {
        $this->authorizer = $authorizer;
    }

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
        $this->authorizer->checkAuthCodeRequest();

		return $next($request);
	}

}
