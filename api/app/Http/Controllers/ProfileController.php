<?php namespace App\Http\Controllers;

use DB, Auth;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return $request->user;
    }

    public function update(Request $request)
    {
        $request->user->fill(array_only($request->json()->all(), ['name', 'avatar']));
        $request->user->save();

        return $request->user;
    }
}
