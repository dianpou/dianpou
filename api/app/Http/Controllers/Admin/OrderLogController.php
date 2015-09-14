<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderLogController extends NestedResourceController
{
    protected $model = 'App\Models\Order';
    protected $relation = 'logs';
    protected $relation_model = 'App\Models\OrderLog';

    public function index(Request $request, $order_id)
    {
        return $this->resources->findOrFail($order_id)->logs()->orderBy('created_at', 'DESC')->get();
    }
}
