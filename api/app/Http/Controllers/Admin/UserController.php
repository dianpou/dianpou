<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;

class UserController extends Controller
{
    protected $model = 'App\Models\User';
    protected $searchable = ['name', 'nickname', 'email'];
}
