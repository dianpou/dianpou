<?php namespace App\Http\Controllers;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Page;

class PageController extends Controller
{
    public $model = '\App\Models\Page';
    protected $filterable = ['position'];
    protected $sortable   = ['sort_index'];
    protected $default_sort = [['sort_index', 'ASC']];
    public function assets(Request $request, $id, $file)
    {
        $page = Page::findOrFail($id);

        return $page->component->response($file);
    }
    public function pathname(Request $request, $pathname)
    {
        return Page::where('pathname', '=', $pathname)->firstOrFail();
    }
}
