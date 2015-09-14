<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\ProductStock;

class OrderProductController extends NestedResourceController
{
    protected $model = 'App\Models\Order';
    protected $relation = 'products';
    protected $relation_model = 'App\Models\OrderProduct';

    public function index(Request $request, $order_id)
    {
        return $this->resources->findOrFail($order_id)->products()->with('product.cover')->get();
    }

    public function store(Request $request, $order_id)
    {
        $order = Order::findOrFail($order_id);
        if (!$order->canEdit()) {
            throw new \Exception('not_editable');
        }

        $sku = $request->json()->get('sku');
        $quantity   = $request->json()->get('quantity');

        $stock = ProductStock::with('product')->where('sku', '=', $sku)->firstOrFail();
        $order_product = $stock->pick($quantity);
        $new_product = response()->created($order->products()->save($order_product));
        $order->calc($order->products()->get());
        $order->save();

        return $new_product;
    }

    public function update(Request $request, $order_id, $id)
    {
        $order = Order::with('products')->findOrFail($order_id);
        if (!$order->canEdit()) {
            throw new \Exception('not_editable');
        }
        $quantity = $request->json()->get('quantity');
        $new_order_products = [];
        $updated_product = null;
        foreach ($order->products as $index => $product) {
            if ($product->id == $id) {
                $product->quantity = $quantity;
                $product->save();
                $updated_product = $product;
            }
            $new_order_products[] = $product;
        }
        if ($updated_product) {
            $order->calc($new_order_products);
            $order->save();

            return response()->updated($updated_product);
        }

        return response()->noContent();
    }
}
