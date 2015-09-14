<?php namespace Tests\API\Admin;

use TestCase;
use App\Models\Product;
use App\Models\ProductPhoto;
use App\Models\UploadFile;
use Storage;

class ProductPhotoTest extends TestCase {
	public static $shared = [];
	public function setUp()
	{
		parent::setUp();
		$this->resetEvents('App\Models\ProductPhoto', 'App\Models\UploadFile');

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
		$this->post(route('api.admin.product.photo.index', $this->fetch('product')), json_encode([
			"sort_index" => 0,
			"file"     => [
				"file_name" => "iphone6-select-2014_GEO_CN.png",
				"file_path" => "data:image/png;base64," . base64_encode(file_get_contents(__DIR__ . '/../data/iphone6-select-2014_GEO_CN.png'))
			]
		]));
		$this->assertNotEmpty($this->response->original->id, $this->response->getContent());
		$this->assertResponseStatus(201);

		return $this->response->original;
	}

	/** @depends testStore */
	public function testShow($photo)
	{
		$this->get(route('api.admin.product.photo.item', [$this->fetch('product'), $photo]));
		$this->assertArrayHasKey('file', $this->response->original, $this->response->getContent());
		$this->assertResponseOk();
	}

	/** @depends testStore */
	public function testIndex($photo)
	{
		$this->get(route('api.admin.product.photo.index', $this->fetch('product')));
		$this->assertResponseOk();
		$this->assertEquals(0, $this->response->original[0]->sort_index, $this->response->getContent());
	}

	/** @depends testStore */
	public function testUpdate($photo)
	{
		$this->put(route('api.admin.product.photo.item', [$this->fetch('product'), $photo]), json_encode([
				"sort_index"=> "999"
		]));
		$this->assertEquals('999', $this->response->original->sort_index, $this->response->getContent());
		$this->assertResponseOk();
	}

	/** @depends testStore */
	public function testDestroy($photo)
	{
		$this->delete(route('api.admin.product.photo.item', [$this->fetch('product'), $photo]));
		$this->assertResponseStatus(204);
		$check = ProductPhoto::find($photo->id);
		$this->assertNull($check);
		$check  = UploadFile::find($photo->file_id);
		$this->assertNull($check);
		$this->assertFalse(Storage::exists($photo->file->file_path));
		$this->clear();
	}

	public function clear()
	{
		$this->fetch('product')->delete();
	}
}
