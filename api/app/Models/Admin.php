<?php namespace App\Models;

use App\Libraries\Interfaces\Operator;
use App\Libraries\Authenticatable;

class Admin extends Model {
    use Authenticatable;
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];
    public function getValidations() {
        return array(
            'email' => 'required|email|unique:admins,email' . $this->uniqueExcept(),
            'name'  => 'required|unique:admins,name'. $this->uniqueExcept(),
            );
    }
    public function save($options = [])
    {
        if ($this->isDirty()) {
            $changed = $this->getDirty();
            if ($changed['password']) {
                $this->password = \Hash::make($changed['password']);
            }
        }
        parent::save($options);
    }
    public function roles()
    {
        return $this->belongsToMany('App\Models\AdminRole', 'admin_2_role', 'admin_id', 'role_id');
    }
    public function getOperatorType()
    {
        return 'App\Models\Admin';
    }
    public function getOperatorId()
    {
        return $this->id;
    }
}
