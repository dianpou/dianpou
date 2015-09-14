<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use DB, Auth;
use App\Exceptions\APIException;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\Bag;
use App\Models\Order;
use App\Models\User;

class TestController extends Controller
{
    protected $model = 'App\Models\Product';

    public function test(Request $request)
    {
    }
}