<?php namespace App\Http\Controllers;

use DB, Auth;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        return array_merge((array)$request->user->getAttributes(), [
            'settings' => [
                'currency' => config('dianpou.currency'),
            ]
        ]);
    }
    public function stats(Request $request)
    {
        return [
            'order' => $request->user->orders()->count(),
            'refund'=> $request->user->refunds()->count(),
            'address'=> $request->user->addresses()->count()
        ];
    }
}
