<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;
use App\Models\ProductStock;

class ProductStockController extends NestedResourceController {

	protected $model = 'App\Models\Product';
	protected $relation = 'stocks';
	protected $relation_model = 'App\Models\ProductStock';

	public function index(Request $request, $product_id)
	{
		return $this->resources
					->findOrFail($product_id)
					->stocks()
					->with('cover')
					->orderBy('price', 'ASC')
					->orderBy('id', 'ASC')
					->get();
	}

	public function show(Request $request, $product_id, $stock_id)
	{
		return $this->resources->findOrFail($product_id)->stocks()->with('cover')->find($stock_id);
	}

	public function store(Request $request, $product_id)
	{
		$product = $this->resources->findOrFail($product_id);
		$stock   = new ProductStock($request->json()->all());
		$product->checkStockOption($stock);
		$product->stocks()->save($stock);

		return response()->created($stock);
	}

	public function update(Request $request, $product_id, $stock_id)
	{
		$product = $this->resources->findOrFail($product_id);
		$stock   = $product->stocks()->findOrFail($stock_id);
		$stock->fill($request->json()->all());
		$stock->save();

		return response()->updated($stock);
	}

	public function destroy(Request $request, $product_id, $stock_id)
	{
		$this->resources->findOrFail($product_id)->stocks()->findOrFail($stock_id)->delete();

		return response()->deleted();
	}
}
