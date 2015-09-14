<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use App\Models\PaymentLog;
use App\Models\Plugin;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $model = 'App\Models\Payment';
    protected $searchable = ['payment_name', 'payment_desc'];
    protected $sortable   = ['created_at', 'payment_name'];

    public function gateways(Request $request)
    {
        $gateways = [];
        $availables = Plugin::available('payments');
        foreach ($availables as $name => $meta) {
            $gateways[] = array_merge(['plugin'=>$name], $meta);
        }
        return $gateways;
    }
    // public function logs(Request $request)
    // {
    //     $finder = PaymentLog::select();
    //     $payment_id = $request->input('payment_id', 0);
    //     if ($payment_id) {
    //         $finder->where('payment_id', '=', $payment_id);
    //     }
    //     return response()->paginate($finder);
    // }
}
