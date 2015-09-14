<?php namespace Tests\API;

use TestCase;
class ProductTest extends TestCase {
    public function testShow()
    {
        $this->get(route('api.product.item', ['id'=>1]));
        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertResponseOk();
    }
}
