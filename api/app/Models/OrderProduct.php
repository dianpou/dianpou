<?php namespace App\Models;


class OrderProduct extends Model {

    protected $casts = array(
        'option' => 'json',
        'custom_info' => 'json'
    );
    public function getValidations() {
        return array(
            'order_id' => 'required',
            'product_id' => 'required',
            'product_name' => 'required',
            'sku' => 'required',
            'price' => 'required|numeric',
            'quantity' => 'integer',
            );
    }
    public $timestamps = false;

    public function toArray()
    {
        return array_merge(parent::toArray(), [
            'returnable' => $this->returnable
        ]);
    }

    public function order()
    {
        return $this->belongsTo('App\Models\Order');
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }

    public function getReturnableAttribute()
    {
        return $this->quantity - $this->returned;
    }

    public function stock()
    {
        return $this->belongsTo('App\Models\ProductStock', 'sku', 'sku');
    }

    public function subtotal()
    {
        return ($this->price + $this->tax - $this->discount) * $this->quantity;
    }
}
