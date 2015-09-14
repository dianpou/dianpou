<?php namespace App\Models;

use App\Models\UploadFile;

class Product extends Model {

    protected $casts = array(
        'options' => 'json',
        'specifications' => 'json',
    );

    protected $dependents = ['categories', 'stocks'];

    public function getValidations() {
        return array( 'product_name' => 'required|max:255' );
    }

    public function checkStockOption($stock)
    {
        if ($this->options) {
            foreach ($stock->option as $key => $value) {
                if (!in_array($stock->option[$key], $this->options[$key]['options'])) {
                    throw new \Exception('Undefined option or value: ' . $value);
                }
            }
        }
    }

    /**
     * Relations
     */
    public function categories()
    {
        return $this->belongsToMany('App\Models\Category', 'product_2_category');
    }

    public function photos()
    {
        return $this->hasMany('App\Models\ProductPhoto')->with('file');
    }

    public function cover()
    {
        return $this->hasOne('App\Models\ProductPhoto')->where('sort_index', '=', 0)->with('file');
    }

    public function stocks()
    {
        return $this->hasMany('App\Models\ProductStock');
    }

    public function stock()
    {
        return $this->hasOne('App\Models\ProductStock')
                    ->select(\DB::raw("SUM(stocks) AS total,
                                       COUNT(id)   AS options,
                                       MIN(price)  AS min_price,
                                       MAX(price)  AS max_price,
                                       AVG(price)  AS avg_price, product_id"))
                    ->groupBy('product_id');
    }

    protected static function boot()
    {
        parent::boot();
        // static::updating(function ($product) {
        //     $changed = $product->isDirty() ? $product->getDirty() : false;
        //     if ($changed && $changed['options']) {
        //         // maintain stock
        //         print_r($changed['options']);
        //     }
        // });
        static::deleting(function ($product)
        {
            $ids = ProductPhoto::select()->where('product_id', '=', $product->id)->lists('id');
            ProductPhoto::destroy($ids->toArray());
        });
    }
}
