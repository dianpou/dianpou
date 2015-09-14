<?php namespace App\Models;


class AdminRole extends Model {
    public $casts = array(
        'role_scopes' => 'json'
    );
    public function getValidations() {
        return array(
            'role_name' => 'required|unique:admin_roles,role_name'. $this->uniqueExcept(),
            'role_scopes' => 'required'
            );
    }

    public function admins()
    {
        return $this->belongsToMany('App\Models\Admin', 'admin_2_role', 'role_id');
    }

}
