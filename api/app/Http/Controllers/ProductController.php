<?php namespace App\Http\Controllers;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $model = 'App\Models\Product';

    public function index(Request $request)
    {
        $query = $this->resources->with('cover')->with('stock')->with('categories');

        return parent::index($request, $query);
    }

    public function show(Request $request, $id)
    {
        return $this->resources->with('stock', 'cover', 'categories', 'stocks.cover', 'photos')->findOrFail($id);
    }
}
