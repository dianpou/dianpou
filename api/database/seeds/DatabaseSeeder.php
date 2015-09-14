<?php

use App\Models\User;
use App\Models\Admin;
use App\Models\Page;
use App\Models\AdminRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductPhoto;
use App\Models\ProductStock;
use App\Models\Payment;
use App\Models\Logistics;
use App\Models\Order;
use App\Models\UploadFile;
use App\Models\OrderLock;
use App\Models\OrderRefund;
use App\Models\OrderReturn;
use App\Models\Bag;
use App\Models\OrderProduct;
use App\Libraries\Interfaces\Operator;
use App\Libraries\Misc\SystemOperator;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder {

/**
 * Run the database seeds.
 *
 * @return void
 */
    public function run()
    {
        $this->call('BasicSeeder');
        // Region
        // DB::unprepared(file_get_contents(base_path() . '/database/seeds/regions.sql'));
    }
}
