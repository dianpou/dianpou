<?php namespace App\Http\Controllers;

use DB;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Address;

class AddressController extends Controller
{
    protected $model = 'App\Models\Address';
    public function index(Request $request)
    {
        $query = $this->resources->where('user_id', '=', $request->user->id);

        return parent::index($request, $query);
    }

    public function show(Request $request, $id)
    {
        $query = $this->resources->where('user_id', '=', $request->user->id);

        return $query->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $resource = $this->resources->where('user_id', '=', $request->user->id)->findOrFail($id);
        $resource->fill($request->json()->all());
        $resource->save();

        return response()->updated($resource);
    }

    public function store(Request $request)
    {
        $resource = new $this->model($request->json()->all());
        $resource->user_id = $request->user->id;
        $resource->save();

        return response()->created($resource);
    }

    public function destroy(Request $request, $id)
    {
        $this->resources->where('user_id', '=', $request->user->id)->where('id', '=', $id)->delete();

        return response()->deleted();
    }
}
