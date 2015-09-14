<?php namespace App\Http\Controllers;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;

class RefundLogController extends NestedResourceController
{
    protected $model = 'App\Models\Refund';
    protected $relation = 'logs';
    protected $relation_model = 'App\Models\RefundLog';
    public function index(Request $request, $sn)
    {
        return $this->resources
                    ->where('sn', '=', $sn)
                    ->where('user_id', '=', $request->user->id)
                    ->firstOrFail()
                    ->logs()
                    ->orderBy('created_at', 'DESC')
                    ->get();
    }
}
