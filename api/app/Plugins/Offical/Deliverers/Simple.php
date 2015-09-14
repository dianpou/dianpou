<?php namespace App\Plugins\Offical\Deliverers;

use App\Libraries\Logistics\BaseDeliverer;
use App\Libraries\Logistics\Package;
use App\Libraries\Form;

class Simple extends BaseDeliverer {

    public function getSettingsForm()
    {
        return [
            'effective' => ['type' => Form::TEXT, 'label' => '时效'],
            'price'     => ['type' => Form::TEXT, 'label' => '单价'],
        ];
    }
    public function calc(Package $package)
    {
        return $this->calcByQuantity($package, $this->settings->get('price'));
    }
}
