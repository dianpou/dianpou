<?php namespace App\Http\Controllers;

use DB;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Bag;
use App\Models\Payment;
use App\Models\Logistics;

class CheckoutController extends Controller
{
    protected $model = 'App\Models\Order';
    public function index(Request $request)
    {
        $data = $request->json()->all('bags');
        $payment        = Payment::findOrFail($data['payment_id']);
        $logistics      = Logistics::findOrFail($data['logistics_id']);
        $bags          = Bag::with('stock.product')->find($data['bags']);
        $order = new Order(array_except($data, 'bags'));

        \DB::transaction(function () use($bags, $logistics, $payment, $order, $data, $request)
        {
            $order_products = [];
            foreach ($bags as $bag) {
                $order_products[] = $bag->stock->pick($bag->quantity);
                $bag->stock->save();
            }
            $order->user_id = $request->user->id;
            $order->calc($order_products);
            $order->save();
            $order->products()->saveMany($order_products);
            Bag::destroy($data['bags']);
        });

        return response()->created($order);
    }
}
