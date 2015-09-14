<?php namespace App\Libraries\Payment;

use App\Libraries\Interfaces\Payment;
use App\Libraries\Form;
use Omnipay\Omnipay;
use Illuminate\Http\Request;

class Gateway implements Payment
{
    public $settings;
    public $logo;
    protected $gateway;
    public function __construct($settings = [])
    {
        $this->settings = new Form($this->getSettingsForm());
        if ($settings) {
            $this->settings->set($settings);
        }
        $this->init();
    }

    public function getSettingsForm()
    {
        return [];
    }

    public function settings(array $settings = null)
    {
        if (is_array($settings)) {
            return $this->settings->set($settings);
        }

        return $this->settings->get();
    }

    public function omnipay()
    {
        # code...
    }

    public function purchase(Order $order) {}
    public function complete(Order $order) {}
        
    public function isSuccessful($response)
    {
        return $response->isSuccessful();
    }
}
