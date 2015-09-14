<?php namespace App\Models;


class RejectProduct extends Model {

    protected $casts = array(
        'product_specs' => 'json',
        'custom_info' => 'json'
    );
    public function getValidations() {
        return array(
            'reject_id' => 'required',
            'product_id' => 'required',
            'product_name' => 'required',
            'sku' => 'required',
            'price' => 'required|numeric',
            'quantity' => 'integer',
            );
    }
    public $timestamps = false;

    public function Reject()
    {
        return $this->belongsTo('App\Models\Reject');
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }
    public function stock()
    {
        return $this->belongsTo('App\Models\ProductStock', 'sku', 'sku');
    }

}
