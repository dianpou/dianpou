<?php namespace App\Models;

class Category extends Model {

    use \App\Libraries\Treeable;

    public function getValidations() {
        return array(
            'category_name' => 'required|max:50',
            );
    }


    public function parent()
    {
        return $this->belongsTo('App\Models\Category', 'parent_id');
    }

    public function children()
    {
        return $this->hasMany('App\Models\Category', 'parent_id');
    }

    public function products()
    {
        return $this->belongsToMany('App\Models\Product', 'product_2_category');
    }

    protected static function boot()
    {
        parent::boot();
        static::deleting(function ($category) {
            self::where('parents', 'LIKE', $category->parents . $category->id . '/%')->delete();
        });
    }
}
