<?php namespace App\Http\Controllers;

use DB;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderLog;
use App\Models\OrderProduct;
use App\Models\Bag;
use App\Models\Payment;
use App\Models\Logistics;
use App\Libraries\Payment\Order as PayOrder;

class OrderController extends Controller
{
    protected $model = 'App\Models\Order';
    protected $searchable = [
        'logistics_consignee',
        'logistics_address',
        'logistics_zipcode',
        'logistics_mobile',
        'logistics_phone',
        'sn',
    ];
    protected $sortable   = ['created_at', 'updated_at', 'total_amount'];
    protected $filterable = ['order_status', 'payment_status', 'logistics_status', 'created_at'];

    public function index(Request $request)
    {
        $query = $this->resources->with('logistics', 'payment')->where('user_id', '=', $request->user->id);
        return parent::index($request, $query);
    }

    public function show(Request $request, $sn)
    {
        $query = $this->resources->with('logistics', 'payment', 'user', 'products')->where('sn', '=', $sn)->where('user_id', '=', $request->user->id);

        return $query->firstOrFail();
    }

    public function pay(Request $request, $sn)
    {
        $order = $this->resources->with('logistics', 'payment', 'user', 'products')->where('sn', '=', $sn)->where('user_id', '=', $request->user->id)->firstOrFail();

        return redirect($order->payment->gateway->purchase(new PayOrder($order->getAttributes()))->getRedirectUrl());
    }

    public function update(Request $request, $sn)
    {
        $order = $this->resources->where('sn', '=', $sn)->where('user_id', '=', $request->user->id)->firstOrFail();
        if (!$order->canEdit()) {
            throw new \Exception('Order can not be edited');
        }
        $input = array_only($request->json()->all(), [
            'logistics_consignee',
            'logistics_region',
            'logistics_address',
            'logistics_zipcode',
            'logistics_mobile',
            'logistics_phone',
            'logistics_email',
        ]);

        \DB::transaction(function () use($request, $input, $order) {
            $order->fill($input);
            $order->save();
            $order->logs()->save(new OrderLog([
                'do' => 'edit',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($order);
    }

    public function cancel(Request $request, $sn)
    {
        $order = $this->resources->where('sn', '=', $sn)->where('user_id', '=', $request->user->id)->firstOrFail();

        \DB::transaction(function () use($request, $order) {
            $order->cancel()->logs()->save(new OrderLog([
                'do' => 'cancel',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($order);
    }

    public function refund(Request $request, $sn)
    {
        $order = $this->resources->where('sn', '=', $sn)->where('user_id', '=', $request->user->id)->firstOrFail();

        if ($order->order_status == Order::STATUS_COMPLETED) {
            \DB::transaction(function () use($sn, $request, $order) {
                $order->refund($request->json()->all())->logs()->save(new OrderLog([
                    'do' => 'refund',
                    'name' => $request->user->name,
                    'comment' => $request->json()->get('comment'),
                ]));
            });
        } else {
            \DB::transaction(function () use($sn, $request, $order) {
                $order->refundAndCancel($request->json()->get('reason'))->logs()->save(new OrderLog([
                    'do' => 'refund_and_cancel',
                    'name' => $request->user->name,
                    'comment' => $request->json()->get('comment'),
                ]));
            });
        }

        return response()->updated($order);
    }
}
