<?php namespace App\Http\Controllers\Admin;

use DB;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Refund;
use App\Models\RefundProduct;
use App\Models\OrderLog;
use App\Models\OrderProduct;
use App\Models\Payment;
use App\Models\Logistics;

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
        $query = $this->resources->with('logistics', 'payment');
        $query = $this->buildSearch($query, $request->get('q'));
        $query = $this->buildSort($query, $request->get('sort', 'created_at'), $request->get('order', 'DESC'));
        $query = $this->buildFilter($query, $request->get('f'));

        return response()->paginate($query->select(), $request->get('per_page', 15));
    }

    public function show(Request $request, $id)
    {
        return $this->resources->with('logistics', 'payment', 'user')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
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
            'logistics_id',
            'logistics_cod',
            'payment_id',
            ]);
        $order->fill($input);
        $order->save();
        $order->logs()->save(new OrderLog([
            'do' => 'edit',
            'name'  => $request->user->name,
            'comment' => $request->json()->get('comment', ''),
        ]));
        return response()->updated($order);
    }

    public function cancel(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        \DB::transaction(function () use($id, $request, $order) {
            $order->cancel()->logs()->save(new OrderLog([
                'do' => 'cancel',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($order);
    }
    public function confirm(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        \DB::transaction(function () use($id, $request, $order) {
            $order->confirm()->logs()->save(new OrderLog([
                'do' => 'confirm',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($order);
    }

    public function pay(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        \DB::transaction(function () use($id, $request, $order) {
            $order->pay($request->json()->get('total_amount'))->logs()->save(new OrderLog([
                'do' => 'pay',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($order);
    }
    public function ship(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        \DB::transaction(function () use($id, $request, $order) {
            $order->ship($request->json()->get('tracking_number'))->logs()->save(new OrderLog([
                'do' => 'ship',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($order);
    }

    public function refund(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        if ($order->order_status == Order::STATUS_COMPLETED) {
            \DB::transaction(function () use($id, $request, $order) {
                $order->refund($request->json()->all())->logs()->save(new OrderLog([
                    'do' => 'refund',
                    'name' => $request->user->name,
                    'comment' => $request->json()->get('comment'),
                ]));
            });
        } else {
            \DB::transaction(function () use($id, $request, $order) {
                $order->refundAndCancel($request->json()->get('reason'))->logs()->save(new OrderLog([
                    'do' => 'refund_and_cancel',
                    'name' => $request->user->name,
                    'comment' => $request->json()->get('comment'),
                ]));
            });
        }

        return response()->updated($order);
    }

    public function complete(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        \DB::transaction(function () use($id, $request, $order) {
            $order->complete()->logs()->save(new OrderLog([
                'do' => 'complete',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($order);
    }
}
