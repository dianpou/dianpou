<?php namespace App\Libraries\Misc;


class StaticClassAccessor
{
    protected $class_name = '';
    public function __construct($class_name)
    {
        $this->class_name = $class_name;
    }

    public function __call($method, $params)
    {
        return call_user_func_array(array($this->class_name, $method), $params);
    }
}