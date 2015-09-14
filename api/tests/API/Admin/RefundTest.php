<?php namespace Tests\API\Admin;

use TestCase, App\Models\OrderLog, App\Models\Order;
use App\Models\Refund;

class RefundTest extends TestCase {
    protected $order  = null;
    protected $refund = null;
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
        $order = $this->response->original;
        $this->assertResponseStatus(201);
        $this->put(route('api.admin.order.pay', $order), json_encode([
            'total_amount' => $order->total_amount
        ]));
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
        $this->put(route('api.admin.order.refund', $order));
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
        $this->put(route('api.admin.refund.cancel', $refund));
        $refund = $refund->fresh();
        $this->assertEquals('canceled', $refund->refund_status, $this->response->getContent());
        $this->assertResponseOk();

        // 订单会还原成退款发起前的状态
        $order  = $order->fresh();
        $this->assertEquals($before['order_status'], $order->order_status, $this->response->getContent());
        $this->assertEquals(0, $order->total_refunded, $this->response->getContent());
        $this->assertNotEmpty($order->returnable_products);
    }

    public function testConfirm()
    {
        $order = $this->createOrder();
        $this->put(route('api.admin.order.refund', $order), json_encode([
            'reason' => '已经有了',
            'comment'=>'不想要了'
        ]));
        $order = $order->fresh();
        $refund = $order->refunds[0];
        // 确认退款单
        $this->put(route('api.admin.refund.confirm', $refund));
        $refund = $refund->fresh();
        // 状态变更为已确认
        $this->assertEquals('confirmed', $refund->refund_status, $this->response->getContent());
        $this->assertResponseOk();
        $order = $order->fresh();

        // 订单将会自动变更为已取消
        $this->assertEquals('canceled', $order->order_status, $this->response->getContent());
        $this->assertResponseOk();

        return $refund;
    }


    /**
     * @depends testConfirm
     */
    public function testPayAndComplete($refund)
    {
        // 未支付退款前不可完成
        $this->put(route('api.admin.refund.complete', $refund));
        $this->assertResponseStatus(500);

        // 确认支付退款
        $this->put(route('api.admin.refund.pay', $refund), json_encode([
            'total_amount' => $refund->total_amount
        ]));
        $refund = $refund->fresh();
        $this->assertEquals('paid', $refund->payment_status, $this->response->getContent());
        $this->assertResponseOk();

        // 完成退款流程
        $this->put(route('api.admin.refund.complete', $refund));
        $refund = $refund->fresh();
        $this->assertEquals('completed', $refund->refund_status, $this->response->getContent());
        $this->assertResponseOk();
    }

    public function testReturn()
    {
        $order = $this->createOrder();

        // 确认订单
        $this->put(route('api.admin.order.confirm', $order));
        $order = $order->fresh();
        $this->assertEquals('confirmed', $order->order_status, $this->response->getContent());
        $this->assertResponseOk();
        // 发货
        $this->put(route('api.admin.order.ship', $order), json_encode([
            'tracking_number' => '123'
        ]));
        $order = $order->fresh();
        $this->assertEquals('shipped', $order->logistics_status, $this->response->getContent());
        $this->assertResponseOk();

        // 完成
        $this->put(route('api.admin.order.complete', $order));
        $this->assertResponseOk();
        $order = $order->fresh();

        // 申请
        $this->put(route('api.admin.order.refund', $order), json_encode([
            'total_amount'  => $order->total_refundable,
            'reason'   => '有质量问题',
            'comment'  => '有质量问题，要退货',
            'products' => [
                ['order_product_id' => $order->returnable_products[0]['id'], 'quantity' => $order->returnable_products[0]['quantity']]
            ]
        ]));
        $refund = $order->refunds[0];
        $this->assertEquals($order->total_refundable, $refund->total_amount, $this->response->getContent());
        $this->assertResponseOk();
        $order = $order->fresh();
        $this->assertEquals(0, $order->total_refundable);
        $this->assertEquals(0, count($order->returnable_products));
        $refund = $order->refunds[0];
        $this->assertNotEmpty(1, $refund->products);

        // 确认
        $this->put(route('api.admin.refund.confirm', $refund));
        $refund = $refund->fresh();
        $this->assertEquals('confirmed', $refund->refund_status, $this->response->getContent());
        $this->assertResponseOk();

        // 未收货及完成退款前，退款单不可被置为完成
        $this->put(route('api.admin.refund.complete', $refund));
        $this->assertResponseStatus(500);

        // 收货
        $this->put(route('api.admin.refund.returns', $refund));
        $refund = $refund->fresh();
        $this->assertEquals('returned', $refund->return_status, $this->response->getContent());
        $this->assertResponseOk();

        // 未支付退款前不可被置为完成
        $this->put(route('api.admin.refund.complete', $refund));
        $this->assertResponseStatus(500);

        $this->put(route('api.admin.refund.pay', $refund), json_encode([
            'total_amount' => $refund->total_amount,
        ]));
        $refund = $refund->fresh();
        $this->assertEquals('paid', $refund->payment_status, $this->response->getContent());
        $this->assertResponseOk();

        // 完成
        $this->put(route('api.admin.refund.complete', $refund));
        $refund = $refund->fresh();
        $this->assertEquals('completed', $refund->refund_status, $this->response->getContent());
        $this->assertResponseOk();

    }

    /**
     *
     * @depends testPayAndComplete
     */
    public function testIndex()
    {
        $this->get(route('api.admin.refund.index'));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertNotEmpty($this->response->original);
        $this->assertResponseOk();
    }
}
