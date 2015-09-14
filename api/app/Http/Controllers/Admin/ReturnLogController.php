<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;
use App\Models\Order;

class ReturnLogController extends NestedResourceController
{
    protected $model = 'App\Models\Reject';
    protected $relation = 'logs';
    protected $relation_model = 'App\Models\RejectLog';
}