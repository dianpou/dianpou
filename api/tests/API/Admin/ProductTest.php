<?php namespace Tests\API\Admin;

use TestCase;

class ProductTest extends TestCase {
	public function setUp()
	{
		parent::setUp();
		$this->resetEvents('App\Models\Product');
	}

	public function testStore()
	{
		$this->post(route('api.admin.product.index'), '
			{
				"product_name": "iPhone 6",
				"product_desc": "iPhone 6",
				"status": "available",
				"options": [
					{"name": "颜色", "options":["深空灰", "银色", "金色"]},
					{"name": "容量", "options":["16GB", "64GB", "128GB"]}
				],
				"specifications": [{"attr_name": "高度", "attr_group": "重量和尺寸", "attr_value": "138.1 毫米(5.44 英寸)"}, {"attr_name": "宽度", "attr_group": "重量和尺寸", "attr_value": "67.0 毫米 (2.64 英寸)"}, {"attr_name": "厚度", "attr_group": "重量和尺寸", "attr_value": "6.9 毫米 (0.27 英寸)"}, {"attr_name": "重量", "attr_group": "重量和尺寸", "attr_value": "129 克 (4.55 盎司)"}]
			}
		');
		$this->assertResponseStatus(201);
		$this->assertNotEmpty($this->response->original->id);

		return $this->response->original;
	}

	/**
	 *
	 * @depends testStore
	 */
	public function testShow($product)
	{
		$this->get(route('api.admin.product.item', $product));
		$response = $this->response->original->toArray();
		$this->assertArrayHasKey('stock', $response);
		$this->assertArrayHasKey('cover', $response);
		$this->assertArrayHasKey('categories', $response);
		$this->assertResponseOk();
	}

	/**
	 *
	 * @depends testStore
	 */
	public function testUpdate($product)
	{
		$options = $product->options;
		unset($options[1]['options'][2]);
		$this->patch(route('api.admin.product.item', $product), json_encode([
				"product_name"=> "Edited",
				"options"=> $options,
		]));
		$this->assertResponseOk();
		$this->assertEquals('Edited', $this->response->original->product_name, $this->response->getContent());
	}

	/**
	 *
	 * @depends testStore
	 */
	public function testIndex()
	{
		$this->get(route('api.admin.product.index'));
		$this->assertResponseOk();
		$this->assertInternalType('array', $this->response->original);
		$this->assertArrayHasKey('stock', $this->response->original[0]);
		$this->assertArrayHasKey('cover', $this->response->original[0]);
		$this->assertArrayHasKey('categories', $this->response->original[0]);
	}

	/**
	 *
	 * @depends testStore
	 */
	public function testDestroy($product)
	{
		$reponse = $this->delete(route('api.admin.product.item', $product));
		$this->assertResponseStatus(204);
	}
}
