<?php namespace App\Libraries;

class Taxer {
    protected $taxRates = array();
    protected $settings = array();
    public static function singleton()
    {
        static $instance = null;
        if ($instance === null) {
            $instance = new static;
        }

        return $instance;
    }
    public function __construct($settings = array())
    {
        $this->settings = $settings;
    }
    public function calc($price, $region)
    {
        return $price * $this->getTaxRate($region);
    }

    public function getTaxRate($region)
    {
        // TODO
        $rate = @$this->taxRates[$region[0]];

        return $rate ? $rate : 0;
    }
}