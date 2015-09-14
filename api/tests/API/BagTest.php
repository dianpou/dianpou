<?php namespace Tests\API;

use TestCase;
use App\Models\ProductStock;
class BagTest extends TestCase {
    public function setUp()
    {
        parent::setUp();
        $this->resetEvents('App\Models\Bag');
        $this->headers = [
            'Authorization' => 'SyjKhdQ1JcKs1S6X18VQW2LaTclJYzW4AC1dfkFk',
            ];
    }

    public function testStore()
    {
        $sku = 'iphone616-gray';
        $this->post(route('api.bag.index'), json_encode([
            'product_id' => 1,
            'sku'        => $sku,
            'quantity'   => 1
            ]));
        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertResponseStatus(201);

        return $this->response->original;
    }


    /**
    *
    * @depends testStore
    */
    public function testRepeatStore($bag)
    {
        $sku = 'iphone616-gray';
        $this->post(route('api.bag.index', ['test'=>1]), json_encode([
            'product_id' => 1,
            'sku'        => $sku,
            'quantity'   => 1
        ]));
        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertEquals($this->response->original->quantity, $bag->quantity + 1, $this->response->getContent());
        $this->assertResponseStatus(201);
        $bag = $this->response->original;

        $this->post(route('api.bag.index', ['test'=>1]), json_encode([
            'product_id' => 1,
            'sku'        => $sku,
            'quantity'   => 1,
        ]));
        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertEquals($this->response->original->quantity, $bag->quantity + 1, $this->response->getContent());
        $this->assertResponseStatus(201);

        return $this->response->original;
    }

    /**
    *
    * @depends testStore
    */
    public function testShow($bag)
    {
        $this->get(route('api.bag.item', $bag));
        $response = $this->response->original->toArray();
        $this->assertArrayHasKey('product', $response);
        $this->assertArrayHasKey('stock', $response);
        $this->assertResponseOk();
    }

    /**
    *
    * @depends testStore
    */
    public function testUpdate($bag)
    {
        $this->put(route('api.bag.item', $bag), json_encode([
            'quantity' => 2
            ]));
        $this->assertSame(2, $this->response->original->quantity, $this->response->getContent());
        $this->assertResponseOk();
    }


    /**
    *
    * @depends testStore
    */
    public function testIndex()
    {
        $this->get(route('api.bag.index'));
        $this->assertArrayHasKey('stock', $this->response->original[0]);
        $this->assertArrayHasKey('product', $this->response->original[0]);
        $this->assertArrayHasKey('quantity', $this->response->original[0]);
        $this->assertResponseOk();
    }


    /**
    *
    * @depends testStore
    */
    public function testDestroy($bag)
    {
        $reponse = $this->delete(route('api.bag.item', $bag));
        $this->assertResponseStatus(204);
    }
}
