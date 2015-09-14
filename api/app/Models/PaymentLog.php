<?php namespace App\Models;


class PaymentLog extends Model {
    public $timestamps = false;
    public function getValidations() {
        return array(
            'payment_id' => 'required|integer',
            'payment_sn' => 'required',
            'payment_order_amount' => 'required|numeric',
            'payment_action' => 'required',
            'payment_return' => 'required',
            );
    }
}
