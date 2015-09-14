<?php namespace App\Http\Middleware;

use Closure;
use Exception;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use App\Exceptions\ValidationException;
use League\OAuth2\Server\Exception\OAuthException;

class APIExceptionHandlerMiddleware {

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		try {
            error_reporting(E_ALL ^ E_NOTICE ^ E_STRICT);
			return $next($request);
		} catch (Exception $e) {
            $exception = array('message' => $e->getMessage(), 'errors' => [], 'code' => $e->getCode());
            $status_code = 500;

            if ($e instanceof HttpException) {
                $status_code = $e->getStatusCode();
            }
            if ($e instanceof OAuthException) {
                $status_code = $e->httpStatusCode;
            }
            if ($e instanceof ValidationException) {
                $exception['errors'] = $e->messages->getMessages();
            }
            if ($e instanceof ModelNotFoundException) {
                $status_code = 404;
            }
            if ($e instanceof QueryException) {
                if ($e->getCode() == 23505) {
                    $status_code = 409;
                }
            }

            if (env('APP_DEBUG')) {
                $exception['trace'] = $e->getTrace();
            }

            return response($exception, $status_code);
		}
	}

}
