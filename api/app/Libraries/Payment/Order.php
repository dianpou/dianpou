<?php namespace App\Libraries\Payment;

use App\Libraries\Interfaces\Payment;

class Order implements \ArrayAccess
{
    protected $container = [];
    public function toArray()
    {
        return $this->container;
    }
    public function __construct($container = [])
    {
        $this->container = $container;
    }

    public function __get($key)
    {
        return array_get($this->container, $key);
    }

    public function __set($key, $value)
    {
        return array_set($this->container, $key, $value);
    }

    public function offsetSet($offset, $value) {
        if (is_null($offset)) {
            $this->container[] = $value;
        } else {
            $this->container[$offset] = $value;
        }
    }
    public function offsetExists($offset) {
        return isset($this->container[$offset]);
    }
    public function offsetUnset($offset) {
        unset($this->container[$offset]);
    }
    public function offsetGet($offset) {
        return isset($this->container[$offset]) ? $this->container[$offset] : null;
    }
}
