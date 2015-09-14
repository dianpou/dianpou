<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class BasicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call('AdminSeeder');
        $this->call('OAuthSeeder');
        $this->command->info('Basic Data seeded');
    }
}
