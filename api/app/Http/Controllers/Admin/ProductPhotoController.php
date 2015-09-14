<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use App\Models\ProductPhoto;

class ProductPhotoController extends NestedResourceController {

	protected $model = 'App\Models\Product';
	protected $relation = 'photos';
	protected $relation_model = 'App\Models\ProductPhoto';

	public function index(Request $request, $product_id)
	{
		$query = $this->resources->findOrFail($product_id)->photos()->select()->orderBy('sort_index', 'asc');
		$stock_id = $request->input('stock_id');
		if ($stock_id) {
			$query->where('stock_id', '=', $stock_id);
		}
        return response($query->get());
	}

	public function store(Request $request, $product_id)
	{
		$product = $this->resources->findOrFail($product_id);
		$photo = new \App\Models\ProductPhoto(empty($requst->files) ? $request->json()->all(): $request->all());
		$product->photos()->save($photo);

		return response()->created($photo->load('file'));
	}

	public function update(Request $request, $product_id, $id)
	{
		$product = $this->resources->findOrFail($product_id);
		$photo   = $product->photos()->find($id);
		$photo->fill($request->json()->all());
		$photo->save();

		return response()->updated($photo);
	}

	public function destroy(Request $request, $product_id, $id)
	{
		$this->resources->findOrFail($product_id)->photos()->findOrFail($id)->delete();

		return response()->deleted();
	}
}
