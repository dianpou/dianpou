<?php namespace App\Models;

use App\Models\Admin;

class OrderLog extends Model {
    public $timestamps = false;
    public $casts = [
        'args' => 'json',
    ];
    public function getValidations() {
        return array(
            'order_id' => 'required',
            'name' => 'required',
            'do' => 'required',
        );
    }

    public function order()
    {
        return $this->belongsTo('App\Models\Order');
    }
}
