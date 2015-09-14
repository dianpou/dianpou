<?php namespace App\Models;


class RefundLog extends Model {
    public $timestamps = false;
    public $casts = [
        'args' => 'json',
    ];
    public function getValidations() {
        return array(
            'refund_id' => 'required',
            'name' => 'required',
            'do' => 'required',
        );
    }
    public function refund()
    {
        return $this->belongsTo('App\Models\Refund');
    }
}
