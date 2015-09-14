<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ProductAttrController extends NestedResourceController {

	protected $model = 'App\Models\Product';
	protected $relation = 'attrs';
	protected $relation_model = 'App\Models\ProductAttr';

	public function store(Request $request, $product_id)
	{
		$product = $this->resources->findOrFail($product_id);
		$attrs = $product->attrs()->createMany($request->json()->all());

		return response()->created($attrs);
	}

	public function destroy(Request $request, $product_id, $id = 'all')
	{
		$product = $this->resources->findOrFail($product_id);
		$product->attrs()->delete();

		return response()->deleted();
	}
}
