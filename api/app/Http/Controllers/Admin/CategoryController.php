<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller {

    protected $model = 'App\Models\Category';

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        return $this->resources->where('parent_id', '=', $request->input('parent_id', 0))->get();
    }

    public function show(Request $request, $id)
    {
        $category = $this->resources->with('children')->findOrFail($id);

        return $category;
    }

    public function tree(Request $request)
    {
        $parent_id = $request->input('parent_id', 0);
        $query = $this->resources;
        if ($parent_id) {
            $parent = Category::findOrFail($parent_id);
            $query->where('parents', 'LIKE', "{$parent->parents}/{$parent_id}/%");
        }
        $categories = $query->get();

        return make_tree($categories);
    }
}
