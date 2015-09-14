<?php namespace App\Http\Controllers\Base;

use DB;
use App\Libraries\Misc\StaticClassAccessor;
use Illuminate\Http\Request;

class NestedResourceController extends Controller {
    protected $model = '';
    protected $relation = '';
    protected $relation_model = '';
    protected $resources = null;

    public function __construct()
    {
        $this->resources = new StaticClassAccessor($this->model);
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request, $parent_id)
    {
        return response()->paginate($this->resources->findOrFail($parent_id)->{$this->relation}()->select());
    }

    public function show(Request $request, $parent_id, $id)
    {
        $resource = $this->resources->findOrFail($parent_id);

        return response($resource->{$this->relation}()->findOrFail($id));
    }

    public function store(Request $request, $parent_id)
    {
        return response()->created($this->resources
                                        ->findOrFail($parent_id)
                                        ->{$this->relation}()
                                        ->save(new $this->relation_model($request->json()->all())));
    }

    public function update(Request $request, $parent_id, $id)
    {
        $resource = $this->resources->findOrFail($parent_id);
        $related_resource   = $this->resources->{$this->relation}()->findOrFail($id);
        $related_resource->fill($request->json()->all());
        $related_resource->save();

        return response()->updated($related_resource);
    }

    public function destroy(Request $request, $parent_id, $id)
    {
        $this->resources->findOrFail($parent_id)->{$this->relation}()->destroy($id);

        return response()->deleted();
    }
}