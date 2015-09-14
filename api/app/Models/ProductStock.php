<?php namespace App\Models;

use App\Models\UploadFile;
class ProductStock extends Model {

    public $timestamps = false;

    protected $casts = array(
        'option' => 'json',
    );

    public function getValidations() {
        return array(
            'sku' => 'required|unique:product_stocks,sku' . $this->uniqueExcept(),
            'product_id' => 'required',
            'price' => 'numeric',
            'stocks' => 'integer',
        );
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }

    public function cover()
    {
        return $this->belongsTo('App\Models\ProductPhoto', 'cover_id')->with('file');
    }

    public function pick($quantity = 1, $custom_info = [])
    {
        $this->stocks -= $quantity;
        if ($this->stocks < 0) {
            throw new \Exception('Stock not enough');
        }
        $product = new OrderProduct([
                'product_id' => $this->product->id,
                'product_name' => $this->product->product_name,
                'cover' => $this->cover ? $this->cover->file->file_path : $this->product->cover->file->file_path,
                'sku' => $this->sku,
                'option' => $this->option,
                'price' => $this->price,
                'quantity' => $quantity,
                'custom_info' => $custom_info,
        ]);

        return $product;
    }
}
