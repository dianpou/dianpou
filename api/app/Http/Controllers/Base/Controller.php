<?php namespace App\Http\Controllers\Base;

use DB;
use Illuminate\Http\Request;
use App\Exceptions\APIException;
use App\Libraries\Misc\StaticClassAccessor;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;

use Illuminate\Foundation\Bus\DispatchesCommands;
use Illuminate\Routing\Controller as LaravelController;
use Illuminate\Foundation\Validation\ValidatesRequests;

class Controller extends LaravelController {
    use DispatchesCommands, ValidatesRequests;
    protected $model = '';
    protected $resources = null;
    protected $searchable = [];
    protected $sortable   = [];
    protected $default_sort = null;
    protected $filterable = [];

    public function __construct()
    {
        $this->resources = new StaticClassAccessor($this->model);
    }

    public function buildSearch($query, $q)
    {
        if (!empty($this->searchable) && $q) {
            $query = $query->where(function($query) use($q) {
                foreach ($this->searchable as $field) {
                    $query = $query->orWhere($field, 'LIKE', '%' . $q. '%');
                }
                return $query;
            });
        }

        return $query;
    }

    public function buildSort($query, $sort, $order)
    {
        if (!empty($this->sortable) && $sort && $order) {
            if (!in_array($sort, $this->sortable)){
                $sort = $this->sortable[0];
            }
            if (!in_array(strtoupper($order), ['ASC', 'DESC'])) {
                $order = 'ASC';
            }
            $query = $query->orderBy($sort, $order);
        } else {
            if (!empty($this->default_sort)) {
                foreach ($this->default_sort as $sort) {
                    $query = $query->orderBy($sort[0], $sort[1]);
                }
            }
        }

        return $query;
    }

    public function buildFilter($query, $filters)
    {
        if (!empty($this->filterable) && !empty($filters)) {
            foreach ($filters as $field => $filter) {
                if (in_array($field, $this->filterable)) {
                    if (!is_array($filter)) {
                        $query = $query->where($field, '=', $filter);
                    } else {
                        if (!empty($filter) && count($filter) == 2) {
                            if (empty($filter[0]) && !empty($filter[1])) {
                                $query = $query->where($field, '<', $filter[1]);
                            }elseif (empty($filter[1]) && !empty($filter[0])) {
                                $query = $query->where($field, '>', $filter[1]);
                            }elseif (!empty($filter[0]) && !empty($filter[1])) {
                                $query = $query->whereBetween($field, $filter);
                            }
                        }
                    }
                }
            }
        }

        return $query;
    }


    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request, $query = null)
    {
        $query = $query ?: $this->resources;
        $query = $this->buildSearch($query, $request->get('q'));
        $query = $this->buildSort($query, $request->get('sort'), $request->get('order', 'DESC'));
        $query = $this->buildFilter($query, $request->get('f'));

        return response()->paginate($query->select(), $request->get('per_page', 15));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $resource = new $this->model($request->json()->all());
        $resource->save();

        return response()->created($resource);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show(Request $request, $id, $query = null)
    {
        $query = $query ?: $this->resources;
        return $query->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $resource = $this->resources->findOrFail($id);
        $resource->fill($request->json()->all());
        $resource->save();

        return response()->updated($resource);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy(Request $request, $id)
    {
        $this->resources->destroy($id);

        return response()->deleted();
    }
}
