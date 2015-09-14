<?php namespace App\Libraries;

use Hash;

trait Authenticatable {
    public function attempt($name, $pass)
    {
        $user = self::where('email', '=', $name)->first();
        if ($user && Hash::check($pass, $user->password)) {
            return $user;
        }
        return false;
    }
}
