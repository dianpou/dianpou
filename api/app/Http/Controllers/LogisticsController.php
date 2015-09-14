<?php namespace App\Http\Controllers;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Plugin;
use App\Models\Logistics;
use App\Libraries\Logistics\Package;

class LogisticsController extends Controller
{
    protected $model = 'App\Models\Logistics';
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
