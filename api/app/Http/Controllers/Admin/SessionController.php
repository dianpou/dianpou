<?php namespace App\Http\Controllers\Admin;

use DB, Auth;
use Authorizer;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        return $request->user;
    }
}
