<?php namespace App\Plugins\Offical\Payments\Paypal;

use App\Libraries\Interfaces\Payment;
use App\Libraries\Payment\Gateway;
use App\Libraries\Payment\Order;
use App\Libraries\Form;
use Illuminate\Http\Request;
use Omnipay\Omnipay;

class Main extends Gateway implements Payment
{
    public function getSettingsForm()
    {
        return [
            'username' => [ 'type' => Form::TEXT, 'label' => 'Username' ],
            'password' => [ 'type' => Form::TEXT, 'label' => 'Password' ],
            'signature' => [ 'type' => Form::TEXT, 'label' => 'Signature' ],
        ];
    }

    public function init()
    {
        $this->gateway = Omnipay::create('PayPal_Express');
        $this->gateway->setUsername($this->settings->get('username'));
        $this->gateway->setPassword($this->settings->get('password'));
        $this->gateway->setSignature($this->settings->get('signature'));
        if (config('app.debug')) {
            $this->gateway->setTestMode(true);
        }

        $this->logo = dirname(__FILE__) . '/logo.png';
    }


    public function purchase(Order $order)
    {
        return $this->gateway->purchase($order->toArray())->send();
    }

    public function complete(Order $order)
    {
        return $this->gateway->completePurchase($order->toArray())->send();
    }
}
