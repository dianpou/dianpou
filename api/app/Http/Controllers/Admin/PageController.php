<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use App\Models\Plugin;
use Illuminate\Http\Request;

class PageController extends Controller
{
    protected $model = 'App\Models\Page';
    protected $searchable = ['title', 'pathname'];
    protected $sortable   = ['sort_index', 'position', 'pathname', 'created_at'];
    protected $default_sort = [['created_at', 'DESC'], ['pathname', 'ASC'], ['sort_index', 'ASC']];

    public function plugins(Request $request)
    {
        $plugins = [];
        $availables = Plugin::available('Pages');
        foreach ($availables as $name => $meta) {
            $plugins[] = array_merge(['plugin'=>$name], $meta);
        }

        return $plugins;
    }
}
