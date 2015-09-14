<?php namespace App\Models;

use App\Libraries\Logistics\Package;
use App\Libraries\Payment\Order as PaymentOrder;
use Carbon\Carbon;

class Order extends Model {
    // ORDER STATUS
    const STATUS_PENDING   = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_COMPLETED = 'completed';
    const STATUS_BRANCHED = 'branched';
    const STATUS_CANCELED  = 'canceled';

    // PAY STATUS
    const STATUS_UNPAID    = 'unpaid';
    const STATUS_PAID      = 'paid';
    // LOGISTICS STATUS
    const STATUS_UNSHIPPED = 'unshipped';
    const STATUS_SHIPPED   = 'shipped';

    public $casts = array(
        'logistics_region' => 'json',
        'branches'         => 'json',
    );

    public function getValidations()
    {
        return array(
            'sn' => 'required|unique:orders,sn' . $this->uniqueExcept(),
            'order_discount' => 'numeric',
            'user_id' => 'required|integer',
            'logistics_consignee' => 'required',
            'logistics_region' => 'required',
            'logistics_address' => 'required',
            'logistics_mobile' => 'required_without:logistics_phone',
            'logistics_phone' => 'required_without:logistics_mobile',
            'logistics_email' => 'email',
            'logistics_id' => 'required',
            'payment_id' => 'required',
            'subtotal_product' => 'numeric',
            'subtotal_tax' => 'numeric',
            'subtotal_discount' => 'numeric',
            'subtotal_logistics' => 'numeric',
            'total_amount' => 'numeric',
        );
    }

    public function toArray()
    {
        return array_merge(parent::toArray(), [
            'operations'=> $this->operations,
            'total_refundable' => $this->total_refundable
        ]);
    }

    public function logistics()
    {
        return $this->belongsTo('App\Models\Logistics', 'logistics_id');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function payment()
    {
        return $this->belongsTo('App\Models\Payment');
    }

    public function products()
    {
        return $this->hasMany('App\Models\OrderProduct');
    }

    public function logs()
    {
        return $this->hasMany('App\Models\OrderLog');
    }


    public function refunds()
    {
        return $this->hasMany('App\Models\Refund');
    }

    public function save(array $options = array())
    {
        if (!$this->sn) {
            $this->sn = $this->genOrderSN();
        }
        parent::save($options);
    }

    public function createPurchaseOrder()
    {
        return new PaymentOrder([
            'transactionId' => $this->sn,
            'amount'        => $this->total_amount,
            'name'          => 'Dianpou Order #' . $this->sn,
            'description'   => '',
            'currency'      => config('dianpou.currency'),
            'returnUrl'     => route('api.cashier.callback', ['sn'=>$this->sn]),
            'cancelUrl'     => route('api.cashier.cancel', ['sn'=>$this->sn])
        ]);
    }

    public function genOrderSN()
    {
        return date('ymdh') . str_pad(rand(0, 99999), 5, 0);
    }

    /**
     * 根据当前的订单信息及给定的商品计算订单价格
     * @param  $order_products
     * @return array
     */
    public function calc($order_products = null)
    {
        $total_amount = $subtotal_product = $subtotal_tax = $subtotal_logistics = $subtotal_discount = 0;
        $products = $order_products === null ? $this->products : $order_products;

        // total_amount = subtotal_product + subtotal_tax + subtotal_logistics - subtotal_discount
        $package = new Package();
        $package->to($this->logistics_region);
        foreach ($products as $product) {
            $subtotal_product += $product->price * $product->quantity;
            $subtotal_discount += $product->discount * $product->quantity;
            $subtotal_tax += $product->tax * $product->quantity;
            $package->add($product->quantity);
        }

        $subtotal_discount += $this->order_discount;
        $subtotal_logistics = $this->logistics->deliverer->calc($package);

        $this->subtotal_product = $subtotal_product;
        $this->subtotal_tax = $subtotal_tax;
        $this->subtotal_discount = $subtotal_discount;
        $this->subtotal_logistics = $subtotal_logistics;
        $this->total_amount = $subtotal_product + $subtotal_tax + $subtotal_logistics - $subtotal_discount;

        return $this;
    }

    public function getTotalRefundableAttribute()
    {
        // 可退款金额 = 订单总金额 - 运费 - 已退款金额
        return  $this->payment_status == Order::STATUS_PAID ?
                    $this->total_amount - $this->subtotal_logistics - $this->total_refunded
                        : 0;
    }

    public function getReturnableProductsAttribute()
    {
        return $this->products->filter(function ($product) {
            return $product->returnable > 0;
        });
    }

    public function getOperationsAttribute()
    {
        return [
            'edit' => $this->canEdit(),
            'pay' => $this->canPay(),
            'confirm' => $this->canConfirm(),
            'ship' => $this->canShip(),
            'complete' => $this->canComplete(),
            'cancel' => $this->canCancel() && $this->order_status != self::STATUS_BRANCHED,
            'refund_and_cancel' => $this->canRefundAndCancel(),
            'refund' => $this->canRefund(),
        ];
    }

    public function canEdit()
    {
        return $this->order_status == self::STATUS_PENDING;
    }

    protected function _refund($args, $refund_type)
    {
        $total_amount = $args['total_amount'];
        $products     = $args['products'];
        $reason       = $args['reason'];
        \DB::transaction(function () use($total_amount, $products, $reason, $refund_type) {
            $refund = new Refund([
                'order_id'      => $this->id,
                'user_id'       => $this->user_id,
                'total_amount'  => $total_amount,
                'refund_type'   => $refund_type,
                'reason'        => $reason,
            ]);
            // TODO: find out why $this->refunds()->save() not working here
            $refund->save();
            $refund_products = [];
            foreach ($products as $key => $product) {
                $order_product = $this->returnable_products->where('id', $product['order_product_id'])->first();
                if (empty($order_product) || $order_product->returnable < $product['quantity']) {
                    throw new \Exception('product_cannot_be_returned');
                }
                $order_product->returned += $product['quantity'];
                $order_product->save();
                $returned = new RefundProduct([
                   'order_product_id' => $product['order_product_id'],
                   'quantity'         => $product['quantity'],
                ]);
                $refund_products[] = $returned;
            }
            $refund->products()->saveMany($refund_products);
            $this->total_refunded += $refund->total_amount;
            $this->save();
        });

        return $this;
    }

    public function canRefund()
    {
        return ($this->order_status == self::STATUS_COMPLETED &&
               $this->total_refundable > 0);
    }


    public function refund($args)
    {
        $total_amount = $args['total_amount'];
        $products     = $args['products'];
        $reason       = $args['reason'];
        if (!$this->canRefund()) {
            throw new \Exception('order_cannot_be_refunded');
        }
        if ($total_amount > $this->total_refundable) {
            throw new \Exception('invalid_refund_total_amount');
        }
        if (empty($products)) {
            throw new \Exception('refund_product_cannot_be_empty');
        }
        $this->_refund($args, 'return');
        return $this;
    }

    public function canRefundAndCancel()
    {
        return in_array($this->order_status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]) &&
               $this->logistics_status == self::STATUS_UNSHIPPED &&
               $this->payment_status == self::STATUS_PAID;
    }

    public function refundAndCancel($reason)
    {
        if (!$this->canRefundAndCancel()) {
            throw new \Exception('order_cannot_be_refunded_and_cancel');
        }

        $branches = [
            'revert' => [
                'order_status' => $this->order_status,
            ],
            'after' => [
                'operation' => 'cancel'
            ]
        ];

        $this->_refund([
            'total_amount' => $this->total_refundable,
            'products' => $this->returnable_products->map(function ($product) {
                return [
                    'order_product_id' => $product->id,
                    'quantity'         => $product->returnable,
                ];
            }),
            'reason'   => $reason,
        ], 'refund');

        return $this->branch($branches);
    }

    public function canCancel()
    {
        // 只有未发货未付款的未完成订单可以被取消，已发货的走售后流程
        return (in_array($this->order_status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]) &&
               $this->logistics_status == self::STATUS_UNSHIPPED &&
               $this->payment_status == self::STATUS_UNPAID) ||
               ($this->order_status == self::STATUS_BRANCHED && $this->payment_status == self::STATUS_PAID);
    }

    public function cancel()
    {
        // 只有待处理的订单可取消
        if (!$this->canCancel()) {
            throw new \Exception('order_canot_be_cancelled');
        }
        $this->order_status = self::STATUS_CANCELED;
        $this->save();
        return $this;
    }

    public function canConfirm()
    {
        return $this->order_status == self::STATUS_PENDING;
    }

    public function confirm()
    {
        if (!$this->canConfirm()) {
            throw new \Exception('order_cannot_be_confirmed');
        }
        $this->order_status = self::STATUS_CONFIRMED;
        $this->save();
        return $this;
    }

    public function canBranch()
    {
        return in_array($this->order_status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]);
    }

    public function branch($branches)
    {
        if (!$this->canBranch()) {
            throw new \Exception('order_cannot_be_branched');
        }
        if (empty($branches['revert']) || empty($branches['after'])) {
            throw new \Exception('invalid_branches');
        }
        $this->branches       = $branches;
        $this->order_status   = self::STATUS_BRANCHED;
        $this->save();

        return $this;
    }

    public function canBranchRevert()
    {
        return $this->order_status == self::STATUS_BRANCHED && !empty($this->branches['revert']);
    }

    public function branchRevert()
    {
        if (!$this->canBranchRevert()) {
            throw new \Exception('order_cannot_be_switch_branchrevert');
        }
        $this->fill($this->branches['revert']);
        $this->save();

        return $this;
    }

    public function canBranchAfter()
    {
        return $this->order_status == self::STATUS_BRANCHED && !empty($this->branches['after']);
    }

    public function branchAfter()
    {
        if (!$this->canBranchAfter()) {
            throw new \Exception('order_cannot_be_switch_branchAfter');
        }
        $this->{$this->branches['after']['operation']}($this->branches['after']['args']);

        return $this;
    }

    public function canComplete()
    {
        // 未确认,未付款,未发货的订单不可完成
        return ($this->order_status == self::STATUS_CONFIRMED &&
                $this->payment_status == self::STATUS_PAID &&
                $this->logistics_status == self::STATUS_SHIPPED);
    }

    public function complete()
    {
        if (!$this->canComplete()) {
            throw new \Exception('order_cannot_be_completed');
        }
        $this->order_status = self::STATUS_COMPLETED;
        $this->save();

        return $this;
    }

    public function canPay()
    {
        return $this->payment_status == self::STATUS_UNPAID;
    }

    public function pay($amount)
    {
        if (!$this->canPay()) {
            throw new \Exception('order_cannot_be_paid');
        }
        if ($amount != $this->total_amount) {
            throw new \Exception('order_amount_inconsistent');
        }
        $this->payment_status = self::STATUS_PAID;
        $this->payment_time   = Carbon::now();
        $this->save();

        return $this;
    }

    public function canShip()
    {
        // 已确认的货到付款的订单或已付款的款到发货订单才可发货
        return $this->order_status == self::STATUS_CONFIRMED && (
                    $this->logistics_cod ||
                    (!$this->logistics_cod && $this->payment_status == self::STATUS_PAID));
    }

    public function ship($tracking_number)
    {
        // 订单确认后才可发货
        if (!$this->canShip()) {
            throw new \Exception('order_cannot_be_shipped');
        }
        // 必须填写包裹跟踪码
        if (!$tracking_number) {
            throw new \Exception('tracking_number_is_empty');
        }
        $this->logistics_status = self::STATUS_SHIPPED;
        $this->logistics_time   = Carbon::now();
        $this->logistics_tracking_number = $tracking_number;
        $this->save();

        return $this;
    }
}
