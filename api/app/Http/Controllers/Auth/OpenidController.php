<?php namespace App\Http\Controllers\Auth;

use DB, Auth, Socialize;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;

class OpenidController extends Controller
{
    public function github(Request $request)
    {
        return Socialize::with('github')->redirect();
    }
    public function facebook(Request $request)
    {
        return Socialize::with('facebook')->redirect();
    }
    public function callback(Request $request)
    {
        $user = Socialize::with('github')->user();

        return $user;
    }
}
