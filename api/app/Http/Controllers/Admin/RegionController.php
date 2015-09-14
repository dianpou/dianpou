<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    protected $model = 'App\Models\Region';
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        return $this->resources->where('parent_id', '=', $request->input('parent_id', 0))->get();
    }
}