<?php namespace App\Http\Controllers;

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
        $query = $this->resources->with('user', 'order')->where('user_id', '=', $request->user->id);
        $query = $this->buildSearch($query, $request->get('q'));
        $query = $this->buildSort($query, $request->get('sort', 'created_at'), $request->get('order', 'DESC'));
        $query = $this->buildFilter($query, $request->get('f'));

        return response()->paginate($query->select(), $request->get('per_page', 15));
    }
    public function show(Request $request, $sn)
    {
        return $this->resources->with('user', 'order', 'products.product')->where('user_id', '=', $request->user->id)->where('sn', '=', $sn)->firstOrFail();
    }

    public function cancel(Request $request, $sn)
    {
        $refund = $this->resources->with('user', 'order')->where('user_id', '=', $request->user->id)->where('sn', '=', $sn)->firstOrFail();

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
}
