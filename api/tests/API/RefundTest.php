<?php namespace Tests\API;

use TestCase, App\Models\OrderLog, App\Models\Order;
use App\Models\Refund;

class RefundTest extends TestCase {
    protected $order  = null;
    protected $refund = null;
    public function setUp()
    {
        parent::setUp();
        $this->resetEvents('App\Models\Order');
        $this->headers = [
            'Authorization' => 'SyjKhdQ1JcKs1S6X18VQW2LaTclJYzW4AC1dfkFk',
        ];
    }
    public function createOrder($args = ['quantity' => 1, 'logistics_cod' => false])
    {
        $this->post(route('api.bag.index'), json_encode([
            'product_id' => 1,
            'sku'        => 'iphone616-gray',
            'quantity'   => $args['quantity'],
            'session_id' => $this->headers['Authorization'],
            'user_id'    => 1,
        ]));
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
        $order = $this->response->original;
        $this->assertResponseStatus(201);
        $this->put(route('api.admin.order.pay', $order), json_encode([
            'total_amount' => $order->total_amount
            ]), [
                'Authorization'=> 'L3gkUwlwCQpUFGwbbX9HuAmc9YsMh8Oe42OQRNiY'
                ]);
        $this->assertResponseOk();
        $order = $this->response->original;

        return $order;
    }

    public function testStore()
    {
        $order = $this->createOrder();
        $total_refundable = $order->total_refundable;
        $this->assertNotEquals(0, $total_refundable);
        $this->assertNotEquals($order->total_amount, $total_refundable);
        // 已付款的订单无直接取消的操作
        $this->assertFalse($order->operations['cancel']);
        // 已付款未发货的订单的取消可以通过退款并取消订单完成
        $this->assertTrue($order->operations['refund_and_cancel']);

        // 退款
        $this->put(route('api.order.refund', ['sn'=>$order->sn]));
        $order = $order->fresh();

        // 订单状态变为已分支
        $this->assertEquals('branched', $order->order_status, $this->response->getContent());
        // 可退款金额变成0
        $this->assertEquals(0, $order->total_refundable);
        // 可退回商品为空
        $this->assertEmpty($order->returnable_products);
        $this->assertResponseOk();

        // 获取退款单
        $refund = $order->refunds()->first();

        // 退款单初始状态pending
        $this->assertEquals('pending', $refund->refund_status, $this->response->getContent());
        // 由于订单尚未发货，退款单类型为仅退款
        $this->assertEquals('refund', $refund->refund_type);
        // 退款金额应与订单初始可退款金额相等
        $this->assertEquals($total_refundable, $refund->total_amount);
        // 退款单包含一个退款商品
        $this->assertEquals(1, $refund->products()->first()->quantity);


        return [$order, $refund];
    }

    /**
     *
     * @depends testStore
     */
    public function testCancel($args)
    {
        list($order, $refund) = $args;

        // 取消退款单
        $before= $order->branches['revert'];
        $this->put(route('api.refund.cancel', ['sn'=>$refund->sn]));
        $refund = $refund->fresh();
        $this->assertEquals('canceled', $refund->refund_status, $this->response->getContent());
        $this->assertResponseOk();

        // 订单会还原成退款发起前的状态
        $order  = $order->fresh();
        $this->assertEquals($before['order_status'], $order->order_status, $this->response->getContent());
        $this->assertEquals(0, $order->total_refunded, $this->response->getContent());
        $this->assertNotEmpty($order->returnable_products);
    }

    /**
     *
     * @depends testStore
     */
    public function testIndex()
    {
        $this->get(route('api.refund.index'));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertNotEmpty($this->response->original);
        $this->assertResponseOk();
    }
}
