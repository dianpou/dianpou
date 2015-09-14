<?php namespace App\Libraries\Logistics;

use App\Libraries\Interfaces\Deliverer;
use App\Libraries\Form;

class BaseDeliverer implements Deliverer
{
    public $settings;
    public function __construct($settings = [])
    {
        $this->settings = new Form($this->getSettingsForm());
        if ($settings) {
            $this->settings->set($settings);
        }
    }

    public function getSettingsForm()
    {
        return [];
    }

    public function calc(Package $package)
    {
        return $this->calcByQuantity($package, $this->settings['price']);
    }

    public function calcByQuantity($package, $price)
    {
        return $package->getQuantity() * $price;
    }

    public function ship(Package $package)
    {
        return false;
    }

    public function settings(array $settings = null)
    {
        if (is_array($settings)) {
            return $this->settings->set($settings);
        }

        return $this->settings->get();
    }
}