<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\Admin;
use App\Models\AdminRole;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        // Admin
        DB::table('admins')->truncate();
        $admin = new Admin;
        $admins = array(array(
            'email' => 'admin@dianpou.com',
            'name' => 'Admin',
            'password' => 'admin',
            'avatar'  => 'http://tp3.sinaimg.cn/1812747674/180/5606472968/1',
        ));
        foreach ($admins as $admin) {
            $admin = new Admin($admin);
            $admin->save();
        }
        // Admin Role
        DB::table('admin_roles')->truncate();
        $adminrole = new AdminRole;
        $super_admin = new AdminRole(array(
            'role_name' => 'Administrator',
            'role_scopes' => ['all'],
        ));
        $super_admin->save();
        $admin->roles()->attach($super_admin);
    }
}
