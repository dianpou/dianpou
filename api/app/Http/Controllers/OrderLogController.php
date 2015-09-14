<?php namespace App\Http\Controllers;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderLogController extends NestedResourceController
{
    protected $model = 'App\Models\Order';
    protected $relation = 'logs';
    protected $relation_model = 'App\Models\OrderLog';

    public function index(Request $request, $sn)
    {
        return $this->resources
                    ->where('sn', '=', $sn)
                    ->where('user_id', '=', $request->user->id)
                    ->firstOrFail()
                    ->logs()
                    ->orderBy('created_at', 'DESC')
                    ->get();
    }
}
