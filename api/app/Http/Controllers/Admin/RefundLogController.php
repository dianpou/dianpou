<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\NestedResourceController;
use Illuminate\Http\Request;

class RefundLogController extends NestedResourceController
{
    protected $model = 'App\Models\Refund';
    protected $relation = 'logs';
    protected $relation_model = 'App\Models\RefundLog';
}