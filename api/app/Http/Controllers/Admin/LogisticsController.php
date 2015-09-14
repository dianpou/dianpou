<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Plugin;
use App\Models\Logistics;
use App\Libraries\Logistics\Package;

class LogisticsController extends Controller
{
    protected $model = 'App\Models\Logistics';
    protected $searchable = ['logistics_name', 'logistics_desc'];
    protected $sortable   = ['created_at', 'logistics_name'];
    public function index(Request $request)
    {
        // sleep(3);
        return parent::index($request);
    }

    public function deliverers()
    {
        $deliverers = [];
        $availables = Plugin::available('deliverers');
        foreach ($availables as $name => $meta) {
            $deliverers[] = array_merge(['plugin'=>$name], $meta);
        }
        return $deliverers;
    }

    public function calculator(Request $request, $id)
    {
        $logistics = Logistics::findOrFail($id);
        $package   = new Package();
        $items = $request->json()->get('items', []);
        foreach ($items as $index => $item) {
            $package->add($item);
        }
        $package->to($request->json()->get('to'));
        return [
            'price' => $logistics->deliverer->calc($package)
        ];
    }
}
