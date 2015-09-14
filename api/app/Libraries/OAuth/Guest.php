<?php namespace App\Libraries\OAuth;

/**
 *
 */
class Guest
{
    public $guest    = true;
    public $name     = 'guest';
    public $nickname = 'guest';
    public function __toString()
    {
        return json_encode($this);
    }
    public function getAttributes()
    {
        return [
            'name' => $this->name,
            'guest' => true,
            'nickname' => 'guest',
        ];
    }
}
