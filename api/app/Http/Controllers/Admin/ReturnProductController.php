<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;
use App\Models\Order;

class ReturnProductController extends NestedResourceController
{
    protected $model = 'App\Models\Reject';
    protected $relation = 'products';
    protected $relation_model = 'App\Models\RejectProduct';

    public function index(Request $request, $order_id)
    {
        return $this->resources->findOrFail($order_id)->products;
    }
}