<?php namespace App\Models;

use App\Libraries\Taxer;

class Address extends Model {
    public $casts = [
        'region' => 'json',
    ];
    public function getValidations()
    {
        return array(
            'user_id' => 'required|integer',
            'consignee' => 'required',
            'region' => 'required',
            'address' => 'required',
            'mobile' => 'required_without:phone',
            'phone' => 'required_without:mobile',
            'email' => 'email',
        );
    }
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
