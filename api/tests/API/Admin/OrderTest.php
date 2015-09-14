<?php namespace Tests\API\Admin;

use TestCase, App\Models\OrderLog, App\Models\Order;

class OrderTest extends TestCase {
    public function setUp()
    {
        parent::setUp();
        $this->resetEvents('App\Models\Order');
    }

    public function createOrder($args = ['quantity' => 1, 'logistics_cod' => false])
    {
        $this->post(route('api.bag.index'), json_encode([
            'product_id' => 1,
            'sku'        => 'iphone616-gray',
            'quantity'   => $args['quantity'],
            'session_id' => $this->headers['Authorization'],
            'user_id'    => 1,
        ]), [
            'Authorization' => 'SyjKhdQ1JcKs1S6X18VQW2LaTclJYzW4AC1dfkFk',
        ]);
        $bag = $this->response->original;
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
            'logistics_cod' => $args['logistics_cod'],
            'logistics_tracking_number' => '',
            'payment_id' => 1,
        ]));

        return $this->response->original;
    }

    public function testStore()
    {
        $this->post(route('api.bag.index'), json_encode([
            'product_id' => 1,
            'sku'        => 'iphone616-gray',
            'quantity'   => 1,
            'session_id' => $this->headers['Authorization'],
            'user_id'    => 1,
        ]), [
            'Authorization' => 'SyjKhdQ1JcKs1S6X18VQW2LaTclJYzW4AC1dfkFk',
        ]);
        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertResponseStatus(201);
        $bag = $this->response->original;

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
     *
     * @depends testStore
     */
    public function testShow($order)
    {
        $this->get(route('api.admin.order.item', $order));
        $this->assertResponseOk();
        $this->assertArrayHasKey('logistics', $this->response->original);
        $this->assertArrayHasKey('payment', $this->response->original);
        $this->assertTrue($this->response->original['operations']['edit']);
    }

    /**
     * @depends testStore
     */
    public function testUpdate($order)
    {
        $this->put(route('api.admin.order.item', $order), json_encode([
            'logistics_consignee' => '黄佳彬',
            ]));
        $this->assertEquals('黄佳彬', $this->response->original->logistics_consignee, $this->response->getContent());
        $this->assertResponseOk();
        $logs = $order->logs;
        $this->assertEquals(1, count($logs));
    }

    /**
     * @depends testStore
     */
    public function testCancel($order)
    {
        $this->put(route('api.admin.order.cancel', $order), json_encode([
            'comment' => 'test',
        ]));
        $this->assertResponseOk();
        $order = $this->response->original;
        $this->assertEquals('canceled', $order->order_status);
        $this->get(route('api.admin.order.log.index', $order));
        $this->assertEquals(2, count($this->response->original));
        $this->assertResponseOk();

        return $order;
    }

    /**
     * @depends testCancel
     */
    public function testConfirm($order)
    {
        $this->put(route('api.admin.order.confirm', $order), json_encode([
            'comment' => '资料核对完成',
        ]));
        $this->assertResponseStatus(500);

        $order = $this->createOrder(['quantity'=>5, 'logistics_cod'=>false]);
        $this->put(route('api.admin.order.confirm', $order), json_encode([
            'comment' => '资料核对完成',
        ]));
        $this->assertResponseOk();
        $order = $this->response->original;
        $this->assertEquals('confirmed', $order->order_status);
        $this->assertEquals(1, count($order->logs));

        return $order;
    }

    /**
     * @depends testConfirm
     */
    public function testPayAndShip($order)
    {
        $this->put(route('api.admin.order.ship', $order), json_encode([
            'tracking_number' => '98765',
            'comment' => '顺丰快递',
        ]));
        $this->assertResponseStatus(500);

        $this->put(route('api.admin.order.pay', $order), json_encode([
            'total_amount' => $order->total_amount,
            'comment' => '用户已通过线下支付完成',
        ]));
        $order = $this->response->original;
        $this->assertEquals('paid', $order->payment_status, $this->response->getContent());
        $this->assertNotEmpty($order->payment_time);
        $this->assertResponseOk();

        $this->put(route('api.admin.order.ship', $order), json_encode([
            'tracking_number' => '98765',
            'comment' => '顺丰快递',
        ]));
        $order = $this->response->original;
        $this->assertEquals('shipped', $order->logistics_status, $this->response->getContent());
        $this->assertEquals('98765', $order->logistics_tracking_number, $this->response->getContent());
        $this->assertResponseOk();

        return $order;
    }

    /**
     * @depends testConfirm
     */
    public function testComplete($order)
    {
        $this->put(route('api.admin.order.complete', $order), json_encode([
            'comment' => '订单完成',
        ]));
        $order = $this->response->original;
        $this->assertEquals('completed', $order->order_status, $this->response->getContent());
        $this->assertResponseOk();
        $this->get(route('api.admin.order.log.index', $order));
        $this->assertEquals(4, count($this->response->original));
    }


    /**
     *
     * @depends testStore
     */
    public function testIndex()
    {
        $this->get(route('api.admin.order.index'));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertNotEmpty($this->response->original);
        $this->assertNotEmpty($this->response->original[0]['operations']);
        $this->assertResponseOk();

        $this->get(route('api.admin.order.index', ['q' => 'Elon Musk']));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertEmpty($this->response->original);
        $this->assertResponseOk();

        $this->get(route('api.admin.order.index', ['f'=>['status'=>'completed']]));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertResponseOk();

        $this->get(route('api.admin.order.index', ['f' => ['created_at' => ['2014-01-01', '2014-12-01']]]));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertEmpty($this->response->original);
        $this->assertResponseOk();

        $this->get(route('api.admin.order.index', ['f' => ['created_at' => ['2014-01-01']]]));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertNotEmpty($this->response->original);
        $this->assertResponseOk();

        $this->get(route('api.admin.order.index', ['f' => ['created_at' => ['', '2014-12-01']]]));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertEmpty($this->response->original);
        $this->assertResponseOk();
    }
}
