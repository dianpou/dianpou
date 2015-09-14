<?php namespace App\Models;


class UserOpenid extends Model {
    public function getValidations() {
        return array(
            'user_id' => 'required',
            'provider' => 'required',
            'provider_user_id' => 'required',
            'access_token' => 'required',
            );
    }
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
