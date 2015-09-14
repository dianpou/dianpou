<?php namespace App\Http\Controllers;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Libraries\Payment\Order;

class PaymentController extends Controller
{
    public $model = '\App\Models\Payment';
    public function logo(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        return \Image::make($payment->gateway->logo)->response();
    }
}
