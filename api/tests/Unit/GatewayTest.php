<?php namespace Tests\Unit;


use TestCase;
use App\Plugins\Offical\Payments\Alipay\Main as Alipay;
use App\Libraries\Payment\Order;
use Omnipay\Common\Message\RedirectResponseInterface;
use Illuminate\Http\Request;

/**
*
*/
class GatewayTest extends TestCase
{
    public $gateway;
    public function setUp()
    {
        parent::setUp();
        $this->gateway = new Alipay([
            'pid' => '1111',
            'key' => '222',
            'seller_email' => 'garbinh@gmail.com',
            'ca_cert_path' => storage_path() . '/ca/ca.crt',
        ]);
        $this->order   = new Order([
            'order_amount' => 0.01,
            'sn' => '11111',
            'order_title' => 'Test Order',
        ]);
    }

    public function testPurchase()
    {
        $response = $this->gateway->purchase($this->order);
        $this->assertTrue($response instanceof RedirectResponseInterface);
        $this->assertFalse($response->isSuccessful());
        $this->assertTrue($response->isRedirect());
        $this->assertNotEmpty($response->getRedirectUrl());
        $redirectData = $response->getRedirectData();
        $this->assertSame('http://return', $redirectData['return_url']);
    }
}
