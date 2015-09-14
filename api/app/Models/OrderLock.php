<?php namespace App\Models;


class OrderLock extends Model {
    public $casts = array(
        'subprocess_params' => 'json'
    );
    public function getValidations() {
        return array(
            'subprocess_type' => 'required',
            'subprocess_id' => 'required',
            'order_id' => 'required',
            );
    }
    public $timestamps = false;
    public function order()
    {
        return $this->hasOne('App\Models\Order', 'order_lock_id');
    }
    public function subprocess()
    {
        return $this->morphTo();
    }
}
