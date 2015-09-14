<?php namespace Tests\API\Admin;

use TestCase;
use App\Models\Product;
use App\Models\ProductStock;

class ProductStockTest extends TestCase {
	public static $shared = [];
	public function setUp()
	{
		parent::setUp();

		$this->shared('product', function () {
			$product = new Product([
					"product_name"=> "iPhone 6",
					"product_desc"=> "iPhone 6",
					"status"=> "available",
					"options"=> [
						["name"=> "颜色", "options"=>["深空灰", "银色", "金色"]],
						["name"=> "容量", "options"=>["16GB", "64GB", "128GB"]]
					],
					"specifications"=> [["attr_name"=> "高度", "attr_group"=> "重量和尺寸", "attr_value"=> "138.1 毫米(5.44 英寸)"], ["attr_name"=> "宽度", "attr_group"=> "重量和尺寸", "attr_value"=> "67.0 毫米 (2.64 英寸)"], ["attr_name"=> "厚度", "attr_group"=> "重量和尺寸", "attr_value"=> "6.9 毫米 (0.27 英寸)"], ["attr_name"=> "重量", "attr_group"=> "重量和尺寸", "attr_value"=> "129 克 (4.55 盎司)"]]

			]);
			$product->save();

			return $product;
		});
	}

	public function testStore()
	{
		$this->post(route('api.admin.product.stock.index', $this->product), json_encode([
			"option" => ["深空灰", "16GB"],
			"sku"    => uniqid(),
			"stocks" => 100,
			"price"  => 5288,
		]));
		$this->assertNotEmpty($this->response->original->id, $this->response->getContent());
		$this->assertResponseStatus(201);

		return $this->response->original;
	}

	/** @depends testStore */
	public function testUnique($stock)
	{
		$this->post(route('api.admin.product.stock.index', $this->product), json_encode([
			"option" => ["深空灰", "16GB"],
			"sku"    => uniqid(),
			"stocks" => 100,
			"price"  => 5288,
		]));
		$this->assertResponseStatus(409);
	}

	/** @depends testStore */
	public function testShow($stock)
	{
		$this->get(route('api.admin.product.stock.item', [$this->product, $stock]));
		$response = $this->response->original;
		$this->assertArrayHasKey('stocks', $response, $this->response->getContent());
		$this->assertResponseOk();
	}

	/** @depends testStore */
	public function testProduct($stock)
	{
		$this->get(route('api.admin.product.item', [$this->product]));
		$response = $this->response->original->toArray();
		$this->assertArrayHasKey('stock', $response);
		$this->assertArrayHasKey('cover', $response);
		$this->assertArrayHasKey('categories', $response);
		$this->assertEquals($response['stock']['total'], 100, $this->response->getContent());
		$this->assertResponseOk();
	}

	/** @depends testStore */
	public function testIndex($stock)
	{
		$this->get(route('api.admin.product.stock.index', $this->product));
		$this->assertResponseOk();
	}

	/** @depends testStore */
	public function testUpdate($stock)
	{
		$this->put(route('api.admin.product.stock.item', [$this->product, $stock]), json_encode([
			"price"=> 5388
		]));
		$this->assertEquals('5388', $this->response->original->price, $this->response->getContent());
		$this->assertResponseOk();
	}

	/** @depends testStore */
	public function testDestroy($stock)
	{
		$this->delete(route('api.admin.product.stock.item', [$this->product, $stock]));
		$this->assertResponseStatus(204);
		$check = ProductStock::find($stock->id);
		$this->assertNull($check);
		$this->clear();
	}

	public function clear()
	{
		$this->product->delete();
	}
}
