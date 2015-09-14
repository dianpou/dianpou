<?php namespace App\Models;

use App\Libraries\Taxer;

class Bag extends Model {

    public function getValidations() {
        return array(
            // 'uuid' => 'required|unique:bags,uuid' . $this->uniqueExcept(),
            'user_id' => 'integer',
            'product_id' => 'required|integer',
            'sku' => 'required',
            'quantity' => 'required|integer',
        );
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }

    public function stock()
    {
        return $this->belongsTo('App\Models\ProductStock', 'sku', 'sku');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
