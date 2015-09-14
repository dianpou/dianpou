<?php namespace App\Models;

class Region extends Model {
    use \App\Libraries\Treeable;
    protected $casts = array(
        'extra_attrs' => 'json',
    );
    public $timestamps = false;
    public function getValidations() {
        return array(
            'name' => 'required',
        );
    }
}
