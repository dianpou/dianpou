<?php namespace App\Plugins\Offical\Payments\Alipay;

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
            'pid' => [ 'type' => Form::TEXT, 'label' => 'PID' ],
            'key' => [ 'type' => Form::TEXT, 'label' => 'Key' ],
            'seller_email' => [ 'type' => Form::TEXT, 'label' => '支付宝账号' ],
            'ca_cert_path' => [
                'type' => Form::TEXT,
                'label' => '证书路径(服务器绝对路径)',
                'placeholder' => '如: /etc/certs/alipay.pem',
            ]
        ];
    }

    public function init()
    {
        $this->gateway = Omnipay::create('Alipay_Express');
        $this->gateway->setPartner($this->settings->get('pid'));
        $this->gateway->setKey($this->settings->get('key'));
        $this->gateway->setSellerEmail($this->settings->get('seller_email'));
        $this->logo = dirname(__FILE__) . '/logo.png';
    }

    public function getNotifyUrl(Order $order)
    {
        return 'http://notify';
    }

    public function getReturnUrl(Order $order)
    {
        return 'http://return';
    }

    public function purchase(Order $order)
    {
        $this->gateway->setNotifyUrl($this->getNotifyUrl($order));
        $this->gateway->setReturnUrl($this->getReturnUrl($order));

        return $this->gateway->purchase($this->transform($order))->send();
    }

    public function complete(Order $order)
    {
        $params = [
            'request_params' => Request::input(),
            'ca_cert_path'   => $this->settings->get('ca_cert_path'),
            'sign_type'      => 'MD5',
        ];

        return $this->gateway->completePurchase($params)->send();
    }

    public function isSuccessful($response)
    {
        return $response->isSuccessful() && $response->isTradeStatusOk();
    }

    public function transform(Order $order)
    {
        return [
            'out_trade_no' => $order->sn,
            'subject'      => $order->order_title,
            'total_fee'    => $order->order_amount,
        ];
    }
}
