<?php namespace Tests\API\Admin;

use TestCase;
use App\Models\Product;
use App\Models\ProductPhoto;
use App\Models\UploadFile;
use App\Models\ProductStock;
use Storage;

class ProductStockPhotoTest extends TestCase {
	public static $shared = [];
	public function setUp()
	{
		parent::setUp();
		$this->resetEvents('App\Models\Product', 'App\Models\ProductStock', 'App\Models\ProductPhoto', 'App\Models\UploadFile');

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
		$this->shared('stock', function () {
			return $this->product->stocks()->save(new ProductStock([
				"option" => ["深空灰", "16GB"],
				"sku"    => uniqid(),
				"stocks" => 100,
				"price"  => 5288
			]));
			$stock->save();

			return $stock;
		});
	}

	public function testStore()
	{
		$this->post(route('api.admin.product.photo.index', $this->product), json_encode([
			"sort_index" => 0,
			"file"     => [
				"file_name" => "iphone6-select-2014_GEO_CN.png",
				"file_path"      => "data:image/png;base64," . base64_encode(file_get_contents(__DIR__ . '/../data/iphone6-select-2014_GEO_CN.png'))
			]
		]));
		$photo = $this->response->original;
		$this->assertResponseStatus(201);
		$this->assertNotEmpty($photo->id);

		$this->put(route('api.admin.product.stock.item', [$this->product, $this->stock]), json_encode([
			"cover_id" => $photo->id,
		]));
		$this->assertResponseOk();

		return $photo;
	}

	/** @depends testStore */
	public function testShow($photo)
	{
		$this->get(route('api.admin.product.stock.item', [$this->product, $this->stock]));
		$this->assertEquals($photo->id, $this->response->original->cover_id, $this->response->getContent());
		$this->assertEquals($photo->id, $this->response->original->cover->id, $this->response->getContent());
		$this->assertResponseOk();
		$this->clear();
	}


	public function clear()
	{
		$this->product->delete();
	}
}
