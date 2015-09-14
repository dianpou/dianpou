<?php namespace Tests\API\Admin;

use TestCase;
use App\Models\Order;

class OrderProductTest extends TestCase {
    public function setUp()
    {
        parent::setUp();
        $this->resetEvents('App\Models\Order');
        $this->resetEvents('App\Models\OrderProduct');
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
        $this->order = $order;
    }


    public function testIndex()
    {
        $this->get(route('api.admin.order.product.index', $this->order));
        $this->assertResponseOk();
    }

    public function testUpdate()
    {
        $product = $this->order->products[0];
        $this->put(route('api.admin.order.product.item', [$this->order, $product]), json_encode([
            'quantity' => 2,
            ]));
        $order = Order::find($this->order->id);
        $this->assertNotEquals($this->order->subtotal_product, $order->subtotal_product, $this->response->getContent());
        $this->assertNotEquals($this->order->subtotal_logistics, $order->subtotal_logistics, $this->response->getContent());
        $this->assertResponseOk();
    }
    public function testStore()
    {
        $this->post(route('api.admin.order.product.index', [$this->order]), json_encode([
            'product_id' => 1,
            'sku' => 'iphone616-gold',
            'quantity' => 2,
        ]));
        $order = Order::find($this->order->id);
        $this->assertNotEquals($this->order->subtotal_product, $order->subtotal_product, $this->response->getContent());
        $this->assertNotEquals($this->order->subtotal_logistics, $order->subtotal_logistics, $this->response->getContent());
        $this->assertResponseStatus(201);
    }
}
