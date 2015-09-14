<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;
use App\Models\Refund;
use App\Models\RefundProduct;
use App\Models\ProductStock;

class RefundProductController extends NestedResourceController
{
    protected $model = 'App\Models\Refund';
    protected $relation = 'products';
    protected $relation_model = 'App\Models\RefundProduct';

    public function index(Request $request, $order_id)
    {
        return $this->resources->findOrFail($order_id)->products()->with('product')->get();
    }
}
