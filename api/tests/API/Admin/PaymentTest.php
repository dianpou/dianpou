<?php namespace Tests\API\Admin;

use App\Models\Payment;
use TestCase;

class PaymentTest extends TestCase
{
    public function testStore()
    {
        $this->post(route('api.admin.payment.index'), json_encode([
            "payment_name"=> "支付宝即时到账",
            "payment_desc"=> "支付宝即时到账支付",
            "status"=> "enabled",
            "gateway_name"=> "\App\Plugins\Offical\Payments\Alipay\Main",
            "gateway_settings"=> ["pid" => 'test', "key" => "test", "seller_email" => "garbinh@gmail.com", "ca_cert_path" => storage_path() . '/ca/ca.crt']
        ]));

        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertEquals("支付宝即时到账", $this->response->original->payment_name, $this->response->getContent());
        $this->assertResponseStatus(201);

        return $this->response->original;
    }

    /** @depends testStore */
    public function testShow($payment)
    {
        $this->get(route('api.admin.payment.item', $payment));
        $this->assertSame($payment->payment_name, $this->response->original->payment_name);
        $this->assertResponseOk();
    }

    /** @depends testStore */
    public function testIndex($payment)
    {
        $this->get(route('api.admin.payment.index'));
        $this->assertInternalType('array', $this->response->original);
        $this->assertResponseOk();
    }

    /** @depends testStore */
    public function testDelete($payment)
    {
        $this->delete(route('api.admin.payment.item', $payment));
        $this->assertResponseStatus(204);
    }


    public function testGateways()
    {
        $this->get(route('api.admin.payment.gateways'));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertArrayHasKey('plugin', $this->response->original[0], $this->response->getContent());
        $this->assertResponseOk();
    }
}
