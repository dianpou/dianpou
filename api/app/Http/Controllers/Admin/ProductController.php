<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller {

    protected $model = 'App\Models\Product';
    protected $searchable = ['product_name', 'product_desc'];
    protected $sortable   = ['created_at'];

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $query = $this->resources->with('cover')->with('stock')->with('categories');

        return parent::index($request, $query);
    }

    public function show(Request $request, $id)
    {
        return $this->resources->with('cover', 'categories', 'stock')->find($id);
    }

    public function store(Request $request)
    {
        $input   = $request->json()->all();
        unset($input['categories']);
        $product = new Product($input);
        $product->save();
        if (($categories = $request->json()->get('categories')) && !empty($categories)) {
            if (is_string($categories)) {
                $categories = explode(',', $categories);
            }
            $product->categories()->attach($categories);
        }
        $product->load('categories');

        return response()->created($product);
    }

    public function update(Request $request, $id)
    {
        $product = $this->resources->findOrFail($id);
        $input   = $request->json()->all();
        unset($input['categories']);
        $product->fill($input);
        $product->save();
        if (($categories = $request->json()->get('categories')) && !empty($categories)) {
            $product->categories()->detach();
            if (is_string($categories)) {
                $categories = explode(',', $categories);
            }
            $product->categories()->attach($categories);
        }
        $product->load('categories');

        return response()->updated($product);
    }
}
