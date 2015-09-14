<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class OAuthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
        $now = date('Y-m-d H:i:s');
        DB::table('oauth_clients')->delete();
        DB::table('oauth_clients')->insert(array(
            'id' => 'default',
            'secret' => 'cd87fd1b7b7c754227922556b4f2ae0b',
            'name' => 'Default',
            'created_at' => $now,
            'updated_at' => $now,
        ));

    }
}
