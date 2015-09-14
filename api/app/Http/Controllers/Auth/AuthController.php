<?php namespace App\Http\Controllers\Auth;

use DB, Auth, Response, Authorizer, Socialite;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Bag;
use App\Models\Admin;
use Carbon\Carbon;

class AuthController extends Controller
{
    public static function password_grant($email, $password) {
        $user_type  = \Request::input('user_type');
        if (!in_array($user_type, ['admin', 'user'])) {
            throw new BadRequestHttpException;
        }
        switch ($user_type) {
            case 'admin':
                $user = Admin::attempt($email, $password);
                break;
            default:
                $user = User::attempt($email, $password);
                break;
        }

        return $user ? "{$user_type}:{$user->id}" : false;
    }

    public static function guest_grant() {
        return 0;
    }

    public static function openid_grant($email, $token) {
        $user = User::select('users.*')
                      ->where('email', '=', $email)
                      ->join('user_openids', 'user_openids.user_id', '=', 'users.id')
                      ->where('access_token', '=', $token)
                      ->where('expires_at', '>', Carbon::now())
                      ->first();

        return $user ? "user:{$user->id}" : false;
    }

    public function access_token(Request $request) {
        $request->request->add($request->json()->all());
        return Authorizer::issueAccessToken();
    }
    public function signin(Request $request)
    {
        $request->request->add(array_merge($request->json()->all(),['user_type'=>'user']));
        $token = Authorizer::issueAccessToken();
        $guest_token = $request->header('authorization');
        Bag::where('access_token', '=', $guest_token)->update([
            'access_token'=> $token['access_token'],
        ]);

        return $token;
    }

    public function openid(Request $request, $provider)
    {
        $request->getSession()->set('auth_redirect', $request->input('redirect'));
        return Socialite::with($provider)->redirect();
    }
    public function callback(Request $request, $provider)
    {
        $openid = Socialite::with($provider)->user();
        User::bind($openid, $provider);
        $url = parse_url($request->getSession()->pull('auth_redirect'));
        $url['query'] = ($url['query'] ? '&' : '') . "email={$openid->email}&token={$openid->token}";

        return redirect("{$url['scheme']}://{$url['host']}{$url['path']}?{$url['query']}");

        // return redirect(, [
        //     'email'=>$openid->getEmail(),
        //     'token'=>$openid->token
        // ], HTTP_URL_JOIN_QUERY));
    }
}
