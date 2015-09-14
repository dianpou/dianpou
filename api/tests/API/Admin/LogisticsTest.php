<?php namespace Tests\API\Admin;

use TestCase;

class LogisticsTest extends TestCase {

    public function testStore()
    {
        $this->post(route('api.admin.logistics.index'), json_encode([
            "logistics_name"=> "测试运送",
            "logistics_desc"=> "通常1-3个工作日送达",
            "status"=> "enabled",
            "deliverer_name"=> "\App\Plugins\Offical\Deliverers\Simple",
            "deliverer_settings"=> ["price" => 8, "effective" => "1-3个工作日"]
        ]));

        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertEquals("测试运送", $this->response->original->logistics_name, $this->response->getContent());
        $this->assertResponseStatus(201);

        return $this->response->original;
    }

    /**
     *
     * @depends testStore
     */
    public function testShow($logistics)
    {
        $this->get(route('api.admin.logistics.item', $logistics));
        $this->assertEquals("测试运送", $this->response->original->logistics_name);
        $this->assertResponseOk();
    }

    /**
     *
     * @depends testStore
     */
    public function testUpdate($logistics)
    {
        $this->put(route('api.admin.logistics.item', $logistics), json_encode([
                "logistics_name"=> "顺丰快递",
        ]));
        $this->assertEquals('顺丰快递', $this->response->original->logistics_name, $this->response->getContent());
        $this->assertResponseOk();
    }

    /**
     *
     * @depends testStore
     */
    public function testIndex($logistics)
    {
        $this->get(route('api.admin.logistics.index'));
        $this->assertInternalType('array', $this->response->original);
        $this->assertArrayHasKey('deliverer_settings', $this->response->original[0]);
        $this->assertResponseOk();
    }

    /**
     *
     * @depends testStore
     */
    public function testSearch($logistics)
    {
        $this->get(route('api.admin.logistics.index', ['q' => '顺丰快递']));
        $this->assertInternalType('array', $this->response->original);
        $this->assertEquals($logistics->id, $this->response->original[0]['id'], $this->response->getContent());
        $this->assertResponseOk();
    }

    /**
     *
     * @depends testStore
     */
    public function testSort($logistics)
    {
        $this->get(route('api.admin.logistics.index', ['sort' => 'created_at', 'order'=>'DESC']));
        $this->assertInternalType('array', $this->response->original);
        $this->assertEquals($logistics->id, $this->response->original[0]['id'], $this->response->getContent());
        $this->assertResponseOk();
    }

    /** @depends testStore */
    public function testCalculator($logistics)
    {
        $this->post(route('api.logistics.calculator', $logistics), json_encode([
            'items' => [
                ['quantity'=>1, 'weight' => 0, 'volume' => [0, 0, 0]]
            ],
            'to'  => ['北京']
        ]));
        $this->assertEquals(8, $this->response->original['price'], $this->response->getContent());

        $this->post(route('api.admin.logistics.calculator', $logistics), json_encode([
            'items' => [
                ['quantity'=>1, 'weight' => 0, 'volume' => [0, 0, 0]]
            ],
            'to'  => ['北京']
        ]));
        $this->assertEquals(8, $this->response->original['price'], $this->response->getContent());

        return $logistics;
    }

    /**
     *
     * @depends testCalculator
     */
    public function testDestroy($logistics)
    {
        $reponse = $this->delete(route('api.admin.logistics.item', $logistics));
        $this->assertResponseStatus(204);
    }

    public function testDeliverers()
    {
        $this->get(route('api.admin.logistics.deliverers'));
        $this->assertInternalType('array', $this->response->original, $this->response->getContent());
        $this->assertArrayHasKey('plugin', $this->response->original[0], $this->response->getContent());
        $this->assertResponseOk();
    }


}
