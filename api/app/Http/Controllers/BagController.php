<?php namespace App\Http\Controllers;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Bag;
use App\Models\ProductStock;

class BagController extends Controller
{
    protected $model = 'App\Models\Bag';
    protected $sortable = ['created_at'];
    public function index(Request $request)
    {
        $query = $this->resources->select()->with('product', 'stock.cover');
        if ($request->user->id) {
            $query = $query->where('user_id', '=', $request->user->id);
        } else {
            $query = $query->where('access_token', '=', $request->headers->get('authorization'));
        }
        $query = $this->buildSearch($query, $request->get('q'));
        $query = $this->buildSort($query, $request->get('sort'), $request->get('order'));
        $query = $this->buildFilter($query, $request->get('f'));

        return $query->get();
    }

    public function show(Request $request, $id)
    {
        return $this->resources->with('product', 'stock.cover')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = array_only($request->json()->all(), ['product_id', 'sku', 'quantity']);
        $stock = ProductStock::whereSku($data['sku'])->firstOrFail();
        if ($stock->stocks < $data['quantity']) {
            throw new \Exception('stock not enough');
        }
        $data['access_token'] = $request->headers->get('authorization');
        $data['user_id']    = $request->user->id;
        $bag = Bag::firstOrNew(array_except($data, ['user_id', 'quantity']));
        if ($bag->exists) {
            if ($stock->stocks < $data['quantity']) {
                throw new \Exception('stock not enough');
            }
            $bag->quantity += $data['quantity'];
        } else {
            $bag->quantity =$data['quantity'];
        }
        $bag->user_id = $data['user_id'];
        $bag->save();

        return response()->created($bag);
    }
}
