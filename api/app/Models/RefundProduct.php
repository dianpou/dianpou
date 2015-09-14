<?php namespace App\Models;

use App\Libraries\Interfaces\Subprocess;
use Carbon\Carbon;

class RefundProduct extends Model {
    public $timestamps = false;
    public function getValidations() {
        return array(
            'refund_id' => 'required',
            'order_product_id' => 'required',
            'quantity' => 'required|integer',
        );
    }

    public function refund()
    {
        return $this->belongsTo('App\Models\Refund');
    }

    public function product()
    {
        return $this->belongsTo('App\Models\OrderProduct', 'order_product_id');
    }
}
