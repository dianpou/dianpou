<?php namespace App\Http\Controllers;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Order;
// use App\Libraries\Payment\Order;

class CashierController extends Controller
{
    public function __construct()
    {
        $this->middleware('oauth', ['only' => 'purchase']);
        $this->middleware('noguest', ['only' => 'purchase']);
        parent::__construct();
    }
    public function purchase(Request $request)
    {
        $order = Order::with('payment')
                    ->where('sn', '=', $request->get('sn'))
                    ->where('user_id', '=', $request->user->id)
                    ->firstOrFail();
        $request->getSession()->set('payment_callback_redirect', $request->get('redirect'));
        $request->getSession()->save();

        $response = $order->payment->gateway->purchase($order->createPurchaseOrder());

        if ($response->isSuccessful()) {
            // for those direct pay
        } elseif ($response->isRedirect()) {
            return $response->redirect();
        } else {
            throw new \Exception($response->getMessage());
        }
    }
    public function callback(Request $request)
    {
        $order = Order::with('payment')
                    ->where('sn', '=', $request->get('sn'))
                    ->firstOrFail();
        $response = $order->payment->gateway->complete($order->createPurchaseOrder());
        if ($order->payment->gateway->isSuccessful($response)) {
            $order->pay($order->total_amount);
            return redirect($request->getSession()->pull('payment_callback_redirect'));
        } else {
            throw new \Exception($response->getMessage());
        }
    }
}
