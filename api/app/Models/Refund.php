<?php namespace App\Models;

use App\Libraries\Interfaces\Subprocess;
use App\Models\Order;
use Carbon\Carbon;

class Refund extends Model {
    // REFUND STATUS
    const STATUS_PENDING   = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELED  = 'canceled';

    // PAY STATUS
    const STATUS_UNPAID    = 'unpaid';
    const STATUS_PAID      = 'paid';

    // RETURN STATUS
    const STATUS_UNRETURNED= 'unreturned';
    const STATUS_RETURNED  = 'returned';

    public $casts = array(
        'payment_account' => 'json',
    );

    public function getValidations() {
        return array(
            'order_id' => 'required',
            'user_id' => 'required|integer',
            'sn' => 'required|unique:refunds,sn' . $this->uniqueExcept(),
            'total_amount' => 'required|numeric',
        );
    }
    public function order()
    {
        return $this->belongsTo('App\Models\Order');
    }

    public function toArray()
    {
        return array_merge(parent::toArray(), [
            'operations'=> $this->operations,
        ]);
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function logs()
    {
        return $this->hasMany('App\Models\RefundLog');
    }

    public function products()
    {
        return $this->hasMany('App\Models\RefundProduct');
    }

    public function getOperationsAttribute()
    {
        return [
            'edit' => $this->canEdit(),
            'pay' => $this->canPay(),
            'confirm' => $this->canConfirm(),
            'complete' => $this->canComplete(),
            'cancel' => $this->canCancel(),
        ];
    }
    public function canEdit()
    {
        return $this->refund_status == self::STATUS_PENDING;
    }

    public function save(array $options = array())
    {
        if (!$this->sn) {
            $this->sn = 'RF' . $this->genSN();
        }
        parent::save($options);
    }

    public function genSN()
    {
        return date('ymd') . str_pad(rand(0, 99999), 5, 0);
    }


    public function canCancel()
    {
        return $this->refund_status == self::STATUS_PENDING;
    }

    public function cancel()
    {
        // 只有待处理的订单可取消
        if (!$this->canCancel()) {
            throw new \Exception('refund_cannot_be_cancelled');
        }
        $this->refund_status = self::STATUS_CANCELED;
        $this->save();

        // 退还锁定的数量
        $this->products->each(function ($product) {
            $product->product->returned -= $product->quantity;
            $product->product->save();
        });

        return $this;
    }

    public function canConfirm()
    {
        return $this->refund_status == self::STATUS_PENDING;
    }

    public function confirm()
    {
        if (!$this->canConfirm()) {
            throw new \Exception('refund_cannot_be_confirmed');
        }
        $this->refund_status = self::STATUS_CONFIRMED;
        $this->save();
        return $this;
    }
    public function canPay()
    {
        return $this->payment_status == self::STATUS_UNPAID && $this->refund_status == self::STATUS_CONFIRMED;
    }

    public function pay($amount)
    {
        if (!$this->canPay()) {
            throw new \Exception('refund_cannot_be_paid');
        }
        if ($amount != $this->total_amount) {
            throw new \Exception('refund_amount_inconsistent');
        }
        $this->payment_status = self::STATUS_PAID;
        $this->payment_time   = Carbon::now();
        $this->save();

        return $this;
    }
    public function canReturn()
    {
        // 未确认的退款单不可回收商品
        return $this->refund_status == self::STATUS_CONFIRMED;
    }

    public function returns()
    {
        if (!$this->canReturn()) {
            throw new \Exception('refund_cannot_be_returns');
        }
        $this->return_status = self::STATUS_RETURNED;
        $this->return_time   = Carbon::now();
        $this->save();

        return $this;
    }

    public function canComplete()
    {
        // 未确认,未付款的退款单不可完成
        return ($this->refund_status == self::STATUS_CONFIRMED &&
                $this->payment_status == self::STATUS_PAID);
    }

    public function complete()
    {
        if (!$this->canComplete()) {
            throw new \Exception('refund_cannot_be_completed');
        }
        $this->refund_status = self::STATUS_COMPLETED;
        $this->save();

        return $this;
    }

}
