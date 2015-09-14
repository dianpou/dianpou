<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use App\Models\Order;
use App\Models\OrderLog;
use App\Models\Refund;
use App\Models\RefundProduct;
use App\Models\RefundLog;
use Illuminate\Http\Request;

class RefundController extends Controller
{
    protected $model = 'App\Models\Refund';
    protected $sortable   = ['created_at', 'updated_at', 'total_amount'];
    protected $filterable = ['refund_status', 'payment_status', 'order_id', 'created_at'];

    public function index(Request $request)
    {
        $query = $this->resources->with('user', 'order');
        $query = $this->buildSearch($query, $request->get('q'));
        $query = $this->buildSort($query, $request->get('sort', 'created_at'), $request->get('order', 'DESC'));
        $query = $this->buildFilter($query, $request->get('f'));

        return response()->paginate($query->select(), $request->get('per_page', 15));
    }
    public function show(Request $request, $id)
    {
        return $this->resources->with('user', 'order')->findOrFail($id);
    }

    public function cancel(Request $request, $id)
    {
        $refund = $this->resources->findOrFail($id);

        \DB::transaction(function () use($id, $request, $refund) {
            // 系统会自动退还可退还数量
            $refund->cancel()->logs()->save(new RefundLog([
                'do' => 'cancel',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));

            $refund->order->total_refunded -= $refund->total_amount;
            if ($refund->order->order_status == Order::STATUS_BRANCHED) {
                $refund->order->branchRevert()->logs()->save(new OrderLog([
                    'do' => 'branch_revert',
                    'name' => $request->user->name,
                    'comment' => 'branch revert'
                ]));
            } else {
                $refund->order->save();
            }
        });

        return response()->updated($refund);
    }

    public function confirm(Request $request, $id)
    {
        $refund = $this->resources->findOrFail($id);

        \DB::transaction(function () use($id, $request, $order, $refund) {
            $refund->confirm()->logs()->save(new RefundLog([
                'do' => 'confirm',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));
            if ($refund->order->order_status == Order::STATUS_BRANCHED) {
                $refund->order->branchAfter()->logs()->save(new OrderLog([
                    'do' => 'branch',
                    'name' => $request->user->name,
                    'comment' => 'branch after'
                ]));
            }
        });

        return response()->updated($refund);
    }

    public function pay(Request $request, $id)
    {
        $refund = $this->resources->findOrFail($id);

        \DB::transaction(function () use($id, $request, $refund) {
            $total_amount = $request->json()->get('total_amount');
            $refund->pay($total_amount)->logs()->save(new RefundLog([
                'do' => 'pay',
                'name'  => $request->user->name,
                'args'  => [
                    'total_amount' => $total_amount
                ],
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($refund);
    }

    public function returns(Request $request, $id)
    {
        $refund = $this->resources->findOrFail($id);

        \DB::transaction(function () use($id, $request, $refund) {
            $refund->returns()->logs()->save(new RefundLog([
                'do' => 'returns',
                'name'  => $request->user->name,
                'args'  => $request->json()->all(),
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($refund);
    }

    public function complete(Request $request, $id)
    {
        $refund = $this->resources->findOrFail($id);

        \DB::transaction(function () use($id, $request, $refund) {
            $refund->complete()->logs()->save(new RefundLog([
                'do' => 'complete',
                'name'  => $request->user->name,
                'comment' => $request->json()->get('comment', ''),
            ]));
        });

        return response()->updated($refund);
    }

}
