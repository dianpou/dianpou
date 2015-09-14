<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;

class AdminController extends Controller
{
    protected $model = 'App\Models\Admin';
    protected $searchable = ['name', 'email'];
    public function index(Request $request)
    {
        $query = $this->resources->with('roles');

        return parent::index($request, $query);
    }

    public function show(Request $request, $id)
    {
        return $this->resources->with('roles')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $admin = new Admin(array_only($request->json()->all(), ['email', 'name', 'password']));
        $admin->save();
        if ($roles = $request->json()->get('roles')) {
            $admin->roles()->attach($roles);
        }

        return response()->created($admin);
    }

    public function update(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);
        $admin->fill(array_except($request->json()->all(), 'roles'));
        $admin->save();
        if ($roles = array_filter($request->json()->get('roles'))) {
            $admin->roles()->detach();
            if (!empty($roles)) {
                $admin->roles()->attach($roles);
            }
        }

        return response()->updated($admin);
    }
}
