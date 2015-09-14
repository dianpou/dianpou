<?php namespace Tests\API;

use TestCase;
class OrderTest extends TestCase {
    public function setUp()
    {
        parent::setUp();
        $this->headers = [
            'Authorization' => 'SyjKhdQ1JcKs1S6X18VQW2LaTclJYzW4AC1dfkFk',
        ];
    }

    public function testBag()
    {
        $this->post(route('api.bag.index'), json_encode([
            'product_id' => 1,
            'sku'        => 'iphone616-gray',
            'quantity'   => 1,
        ]));
        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertResponseStatus(201);
        return $this->response->original;
    }

    /**
     * @depends testBag
     */
    public function testCheckout($bag)
    {
        $this->post(route('api.checkout'), json_encode([
            'bags' => [$bag->id],
            'logistics_consignee' => 'Garbin Huang',
            'logistics_region' => ['福建', '福州', '仓山区'],
            'logistics_address' => '福湾新城春风苑2区6号楼802',
            'logistics_zipcode' => '3500001',
            'logistics_mobile' => '18610073651',
            'logistics_phone' => '',
            'logistics_email' => 'garbinh@gmail.com',
            'logistics_id' => 1,
            'logistics_cod' => false,
            'logistics_tracking_number' => '',
            'payment_id' => 1,
        ]));
        $order = $this->response->original;
        $this->assertEquals(1, $order->user_id, $this->response->getContent());
        $this->assertNotEmpty($order->sn);
        $this->assertTrue($order->subtotal_product > 0);
        $this->assertTrue($order->subtotal_tax     == 0);
        $this->assertTrue($order->subtotal_discount== 0);
        $this->assertEquals($bag->stock->price, $order->subtotal_product);
        $this->assertEquals(0, $order->subtotal_tax);
        $this->assertEquals(0, $order->subtotal_discount);
        $this->assertEquals(8, $order->subtotal_logistics);
        $this->assertEquals($order->total_amount, $order->subtotal_logistics + $order->subtotal_product);

        return $order;
    }

    /**
     * @depends testCheckout
     */
    public function testShow($order)
    {
        $this->get(route('api.order.item', ['sn'=>$order->sn]));
        $this->assertResponseOk();
    }

    /**
     * @depends testCheckout
     */
    public function testUpdate($order)
    {
        $this->put(route('api.order.item', ['sn'=>$order->sn]), json_encode([
            'logistics_consignee'=>'edited'
        ]));
        $this->assertEquals('edited', $this->response->original->logistics_consignee, $this->response->getContent());
        $this->assertResponseOk();
    }

    /**
     * @depends testCheckout
     */
    public function testCancel($order)
    {
        $this->put(route('api.order.cancel', ['sn'=>$order->sn]), json_encode([
            'comment' => 'test',
        ]));
        $this->assertResponseOk();
        $order = $this->response->original;
        $this->assertEquals('canceled', $order->order_status);
        $this->get(route('api.order.log.index', ['sn'=>$order->sn]));
        $this->assertEquals(2, count($this->response->original), $this->response->getContent());
        $this->assertResponseOk();

        return $order;
    }

    /**
     *
     * @depends testCheckout
     */
    public function testIndex()
    {
        $this->get(route('api.order.index'));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertNotEmpty($this->response->original);
        $this->assertNotEmpty($this->response->original[0]['operations']);
        $this->assertResponseOk();

        $this->get(route('api.order.index', ['q' => 'Elon Musk']));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertEmpty($this->response->original, $this->response->getContent());
        $this->assertResponseOk();

        $this->get(route('api.order.index', ['f'=>['order_status'=>'completed']]));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertResponseOk();

        $this->get(route('api.order.index', ['f' => ['created_at' => ['2014-01-01', '2014-12-01']]]));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertEmpty($this->response->original);
        $this->assertResponseOk();

        $this->get(route('api.order.index', ['f' => ['created_at' => ['2014-01-01']]]));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertNotEmpty($this->response->original);
        $this->assertResponseOk();

        $this->get(route('api.order.index', ['f' => ['created_at' => ['', '2014-12-01']]]));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertEmpty($this->response->original);
        $this->assertResponseOk();
    }
}
