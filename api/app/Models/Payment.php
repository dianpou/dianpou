<?php namespace App\Models;


class Payment extends Model {
    public $casts = array(
        'gateway_settings' => 'json',
    );

    public function getValidations() {
        return array(
            'payment_name' => 'required|max:50',
            'gateway_name' => 'required',
        );
    }
    public function getGatewayAttribute($value='')
    {
        static $gateway = null;
        if ($gateway === null) {
            $gateway = new $this->gateway_name($this->gateway_settings);
        }

        return $gateway;
    }
    public function toArray()
    {
        return array_merge(parent::toArray(), [
            'logo'=> route('api.payment.logo', $this)
        ]);
    }
    // public function logs()
    // {
    //     return $this->hasMany('App\Models\PaymentLog');
    // }
}
