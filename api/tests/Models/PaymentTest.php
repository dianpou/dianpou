<?php namespace Tests\Models;

use TestCase;
use App\Models\Payment;
use App\Libraries\Interfaces\Payment AS IPayment;

class PaymentTest extends TestCase
{
    public function setUp()
    {
        parent::setUp();
        $attributes = [
            'payment_name' => '支付宝Model',
            'status' => 'enabled',
            'payment_desc' => '支付宝即时到账支付',
            'gateway_name' => '\\App\\Plugins\\Offical\\Payments\\Alipay\\Main',
            'gateway_settings' => [
                'pid' => 'test',
                'key' => 'test_key',
                'seller_email' => 'garbinh@gmail.com',
                'ca_cert_path' => storage_path() . '/ca/ca.crt',
            ]
        ];
        $this->payment = new Payment($attributes);
        $this->payment->save();
    }

    public function testGateway()
    {
        $this->assertTrue($this->payment->gateway instanceof IPayment);
    }
    public function testLogo()
    {
        $this->assertNotEmpty($this->payment->gateway->logo);
    }

    public function tearDown()
    {
        $this->payment->delete();
    }
}
