<?php

use Illuminate\Database\Seeder;
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
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class TestDataSeeder extends Seeder
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
        
        // Test Oauth session
        $session_id = DB::table('oauth_sessions')->insertGetId([
            'client_id' => 'default',
            'owner_type' => 'user',
            'owner_id'=> "user:1",
            'created_at' => $now,
            'updated_at' => $now]);

        DB::table('oauth_access_tokens')->insert([
            'id' => 'SyjKhdQ1JcKs1S6X18VQW2LaTclJYzW4AC1dfkFk',
            'session_id' => $session_id,
            'expire_time' => time() + 86400 * 30,
            'created_at' => $now,
            'updated_at' => $now]);
        $session_id = DB::table('oauth_sessions')->insertGetId([
            'client_id' => 'default',
            'owner_type' => 'user',
            'owner_id'=> "admin:1",
            'created_at' => $now,
            'updated_at' => $now]);

        DB::table('oauth_access_tokens')->insert([
            'id' => 'L3gkUwlwCQpUFGwbbX9HuAmc9YsMh8Oe42OQRNiY',
            'session_id' => $session_id,
            'expire_time' => time() + 86400 * 30,
            'created_at' => $now,
            'updated_at' => $now]);

        // User
        DB::table('users')->truncate();
        $user = new User;
        $users = array(array(
            'email' => 'garbinh@gmail.com',
            'nickname' => 'garbin',
            'name' => 'Garbin Huang',
            'password' => '123456',
            'avatar'  => 'http://tp3.sinaimg.cn/1812747674/180/5606472968/1',
        ));
        foreach ($users as $user) {
            $user = new User($user);
            $user->save();
        }

        // Operator
        $operator_user = User::find(1);
        $operator_admin = Admin::find(1);
        $operator_system = new SystemOperator();

        // Category
        DB::table('categories')->truncate();
        $cate_mac = Category::create(array(
            'category_name' => 'Mac',
            'parent_id'     => 0,
        ));
        $cate_mac->children()->create(['category_name' => 'Macbook Pro']);
        $cate_mac->children()->create(['category_name' => 'Macbook Air']);
        $cate_mac->children()->create(['category_name' => 'iMac']);
        $cate_mac->children()->create(['category_name' => 'Mac mini']);
        $cate_mac->children()->create(['category_name' => 'Mac Pro']);
        $cate_mac = Category::create(array(
            'category_name' => 'iPhone',
            'parent_id'     => 0,
        ));
        $cate_iphone6 = $cate_mac->children()->create(['category_name' => 'iPhone 6']);
        $cate_iphone5s = $cate_mac->children()->create(['category_name' => 'iPhone 5s']);

        // Product
        foreach (['products', 'product_2_category', 'product_photos', 'product_stocks'] as $table) {
            DB::table($table)->truncate();
        }
        $iphone6 = Product::create(array(
            'product_name' => 'iPhone 6',
            'status' => 'available',
            'product_desc' => 'Bigger than bigger',
            'options' => array(
                ['name'=>'颜色', 'options'=>['银色', '深空灰', '香槟金']],
                ['name'=>'容量', 'options'=>['16GB', '64GB', '128GB']]
            ),
            'specifications' => [
                ['attr_name' => '高度', 'attr_group' => '重量和尺寸', 'attr_value' => '138.1 毫米(5.44 英寸)'],
                ['attr_name' => '宽度', 'attr_group' => '重量和尺寸', 'attr_value' => '67.0 毫米 (2.64 英寸)'],
                ['attr_name' => '厚度', 'attr_group' => '重量和尺寸', 'attr_value' => '6.9 毫米 (0.27 英寸)'],
                ['attr_name' => '重量', 'attr_group' => '重量和尺寸', 'attr_value' => '129 克 (4.55 盎司)'],
            ]
        ));

        $all_photo = new UploadFile(array(
            'file' => (string)Image::make(database_path() . '/seeds/files/iphone6p-all.png')->encode('data-url'),
            'file_name' => 'iphone6p-all.png',
        ));
        $all_photo->save();
        $gray_photo = new UploadFile(array(
            'file' => (string)Image::make(database_path() . '/seeds/files/iphone6p-gray.png')->encode('data-url'),
            'file_name' => 'iphone6p-gray.png',
        ));
        $gray_photo->save();
        $gold_photo = new UploadFile(array(
            'file' => (string)Image::make(database_path() . '/seeds/files/iphone6p-gold.png')->encode('data-url'),
            'file_name' => 'iphone6p-gold.png',
        ));
        $gold_photo->save();

        $gold_photo = new UploadFile(array(
            'file' => (string)Image::make(database_path() . '/seeds/files/iphone6p-silver.png')->encode('data-url'),
            'file_name' => 'iphone6p-silver.png',
        ));
        $gold_photo->save();

        $iphone6->photos()->save(new ProductPhoto([
            'product_id' => $iphone6->id,
            'file_id' => $all_photo->id,
            'sort_index' => 0,
        ]));
        $iphone6->photos()->save(new ProductPhoto([
            'product_id' => $iphone6->id,
            'file_id' => $gray_photo->id,
            'sort_index' => 1,
        ]));
        $iphone6->photos()->save(new ProductPhoto([
            'product_id' => $iphone6->id,
            'file_id' => $gold_photo->id,
            'sort_index' => 2,
        ]));

        $gray_iphone616 = $iphone6->stocks()->create(array(
            'sku' => uniqid(),
            'option' => ['深空灰', '16GB'],
            'stocks' => 100,
            'price'  => 5288,
            'cover_id' => $gray_photo->id,
        ));


        $gray_iphone664  = $iphone6->stocks()->create(array(
            'sku' => 'iphone664-gray',
            'option' => ['深空灰', '64GB'],
            'stocks' => 100,
            'price'  => 6088,
        ));
        $gray_iphone6128 = $iphone6->stocks()->create(array(
            'sku' => 'iphone6128-gray',
            'option' => ['深空灰', '128GB'],
            'stocks' => 100,
            'price'  => 6888
        ));
        $silver_iphone616 = $iphone6->stocks()->create(array(
            'sku' => 'iphone616-gray',
            'option' => ['银色', '16GB'],
            'stocks' => 100,
            'price'  => 5288
        ));
        $gold_iphone616 = $iphone6->stocks()->create(array(
            'sku' => 'iphone616-gold',
            'option' => ['香槟金', '16GB'],
            'stocks' => 100,
            'price'  => 5288
        ));
        $iphone5s = Product::create(array(
            'product_name' => 'iPhone 5S',
            'status' => 'available',
            'product_desc' => 'out stock',
            'options' => array(
                ['name'=>'颜色', 'options'=>['银色', '深空灰', '香槟金']],
                ['name'=>'容量', 'options'=>['16GB', '32GB', '64GB']]
            )
        ));
        $iphone6->categories()->attach($cate_iphone6->id);

        // Bag
        foreach (['bags', 'orders', 'order_products', 'logistics', 'payments'] as $table) {
            DB::table($table)->truncate();
        }
        $logistics = Logistics::create(array(
            'logistics_name' => '标准运送',
            'status' => 'enabled',
            'logistics_desc' => '标准运送,免费送货',
            'deliverer_name' => '\App\Plugins\Offical\Deliverers\Simple',
            'deliverer_settings' => array(
                'effective' => '当日达',
                'price'     => 8,
            ),
            'deliverer_cod' => array(
                '北京' => array(
                    '北京' => array('朝阳区')
                ),
                '福建' => array(
                    '福州' => array(
                        '仓山区'
                    )
                )
            ),
        ));
        $payment = Payment::create(array(
            'payment_name' => '支付宝',
            'status' => 'enabled',
            'payment_desc' => '支付宝即时到账支付',
            'gateway_name' => '\App\Plugins\Offical\Payments\Alipay\Main',
            'gateway_settings' => array(
                'pid' => '111',
                'key' => '222',
            ),
        ));

        $page = Page::create([
            "title"=> "首页轮播",
            "pathname"=> "index",
            "position"=> "index",
            "settings"=> [
                'widgets'=>json_decode('[{"widget":"Offical.Slider","style":{"padding":"0px","margin":"-50px 0px 0px 0px"},"data":["<div class=\"slide-item\" style=\"background-image:url(http://images.apple.com/v/home/bx/images/music_hero_medium_2x.jpg)\"><div class=\"carousel-caption\"><h3>Apple Music</h3><p>Free, three-month trial now available</p></div></div>","<div class=\"slide-item\" style=\"background-image:url(http://images.apple.com/v/home/bx/images/music_hero_medium_2x.jpg)\"><div class=\"carousel-caption\"><h3>Apple Music</h3><p>Free, three-month trial now available</p></div></div>"]},{"widget":"Offical.ItemsBelowText","className":"avatar","data":{"title":"Our Customers","subtitle":"They says Apple is awesome!","items":["<img src=\"https://almsaeedstudio.com/themes/AdminLTE/dist/img/user5-128x128.jpg\" alt=\"User Image\" /><a class=\"users-list-name\" href=\"#\">Alexander Pierce</a><span class=\"users-list-date\">Today</span>","<img src=\"https://almsaeedstudio.com/themes/AdminLTE/dist/img/user7-128x128.jpg\" alt=\"User Image\" /><a class=\"users-list-name\" href=\"#\">Alexander Pierce</a><span class=\"users-list-date\">Today</span>","<img src=\"https://almsaeedstudio.com/themes/AdminLTE/dist/img/user6-128x128.jpg\" alt=\"User Image\" /><a class=\"users-list-name\" href=\"#\">Alexander Pierce</a><span class=\"users-list-date\">Today</span>"]}}]')
            ],
        ]);

        $page = Page::create([
            "title"=> "GoPro Hero 4",
            "pathname"=> "hero4",
            "position"=> "nav",
            "settings"=> [
                'widgets' =>json_decode('[{"widget":"Offical.Header","data":{"title":"GoPro Hero4","subtitle":"Be a hero","links":[{"text":"Overview","active":true,"href":"/hero4"},{"text":"Specs","href":"/hero4/specs"},{"text":"Gallery","href":"/hero4/gallery"},{"text":"Buy now","className":"btn btn-primary btn-sm","href":"/hero4/buy"}]}},{"widget":"Offical.Slider","style":{"padding":"0px","margin":"0px"},"data":["<div class=\"slide-item\" style=\"background-image:url(http://images.apple.com/v/home/bx/images/music_hero_medium_2x.jpg)\"><div class=\"carousel-caption\"><h3>Apple Music</h3><p>Free, three-month trial now available</p></div></div>","<div class=\"slide-item\" style=\"background-image:url(http://images.apple.com/v/home/bx/images/music_hero_medium_2x.jpg)\"><div class=\"carousel-caption\"><h3>Apple Music</h3><p>Free, three-month trial now available</p></div></div>"]},{"widget":"Offical.ImageParkText","style":{"backgroundColor":"whitesmoke"},"data":{"text":{"title":"Professional video quality.","subtitle":"HERO4 Session delivers stunning video quality. Capture high-resolution 1440p30 and 1080p60 video that’s sharp and lifelike. High frame rate 720p100 video enables exceptionally smooth slow-motion playback of your best moments."},"img":"http://demandware.edgesuite.net/aasj_prd/on/demandware.static/-/Sites-gopro-products/default/dw3d8fb012/cam-respresent-four/HERO4_Session_Feature_2_video.jpg"}},{"style":{"backgroundColor":"white"},"widget":"Offical.ImageParkText","data":{"text":{"title":"Smallest, lightest GoPro yet.","subtitle":"50% smaller and 40% lighter than other HERO4 cameras,1 HERO4 Session is the most wearable and mountable GoPro ever. With a sleek, versatile design, it’s at home anywhere—from the surf to the snow, to hanging with friends."},"img":"http://demandware.edgesuite.net/aasj_prd/on/demandware.static/-/Sites-gopro-products/default/dw80d5e42d/cam-respresent-four/HERO4_Session_Feature_1_smallestlightest.jpg"}},{"style":{"backgroundColor":"white"},"widget":"Offical.ImageParkText","data":{"text":{"title":"Easy one-button control.","subtitle":"A single press of the shutter button powers on the camera and begins capturing video or Time Lapse photos automatically. A second press of the shutter button stops recording and powers off the camera. It’s that simple."},"img":"http://demandware.edgesuite.net/aasj_prd/on/demandware.static/-/Sites-gopro-products/default/dw9f2ed908/cam-respresent-four/HERO4_Session_Feature_6_OneButton.jpg"}}]')
            ],
        ]);

        $page = Page::create([
            "title"=> "Buy now",
            "pathname"=> "hero4/buy",
            "position"=> "hero4",
            "settings"=> [
                'widgets' =>json_decode('[{"widget":"Offical.Header","data":{"title":"GoPro Hero4","subtitle":"Be a hero","links":[{"text":"Overview","active":true,"href":"/hero4"},{"text":"Specs","href":"/hero4/specs"},{"text":"Gallery","href":"/hero4/gallery"},{"text":"Buy now","className":"btn btn-primary btn-sm","href":"/hero4/buy"}]}},{"widget":"Offical.Slider","style":{"padding":"0px","margin":"0px"},"data":["<div class=\"slide-item\" style=\"background-image:url(http://images.apple.com/v/home/bx/images/music_hero_medium_2x.jpg)\"><div class=\"carousel-caption\"><h3>Apple Music</h3><p>Free, three-month trial now available</p></div></div>","<div class=\"slide-item\" style=\"background-image:url(http://images.apple.com/v/home/bx/images/music_hero_medium_2x.jpg)\"><div class=\"carousel-caption\"><h3>Apple Music</h3><p>Free, three-month trial now available</p></div></div>"]},{"widget":"Offical.ImageParkText","style":{"backgroundColor":"whitesmoke"},"data":{"text":{"title":"Professional video quality.","subtitle":"HERO4 Session delivers stunning video quality. Capture high-resolution 1440p30 and 1080p60 video that’s sharp and lifelike. High frame rate 720p100 video enables exceptionally smooth slow-motion playback of your best moments."},"img":"http://demandware.edgesuite.net/aasj_prd/on/demandware.static/-/Sites-gopro-products/default/dw3d8fb012/cam-respresent-four/HERO4_Session_Feature_2_video.jpg"}},{"style":{"backgroundColor":"white"},"widget":"Offical.ImageParkText","data":{"text":{"title":"Smallest, lightest GoPro yet.","subtitle":"50% smaller and 40% lighter than other HERO4 cameras,1 HERO4 Session is the most wearable and mountable GoPro ever. With a sleek, versatile design, it’s at home anywhere—from the surf to the snow, to hanging with friends."},"img":"http://demandware.edgesuite.net/aasj_prd/on/demandware.static/-/Sites-gopro-products/default/dw80d5e42d/cam-respresent-four/HERO4_Session_Feature_1_smallestlightest.jpg"}},{"style":{"backgroundColor":"white"},"widget":"Offical.ImageParkText","data":{"text":{"title":"Easy one-button control.","subtitle":"A single press of the shutter button powers on the camera and begins capturing video or Time Lapse photos automatically. A second press of the shutter button stops recording and powers off the camera. It’s that simple."},"img":"http://demandware.edgesuite.net/aasj_prd/on/demandware.static/-/Sites-gopro-products/default/dw9f2ed908/cam-respresent-four/HERO4_Session_Feature_6_OneButton.jpg"}}]')
            ],
        ]);

        $page = Page::create([
            "title"=> "DJI Phantom 3",
            "pathname"=> "phantom3",
            "position"=> "nav",
            "settings"=> ['widgets'=>[]],
        ]);

        $page = Page::create([
            "title"=> "Apple Watch",
            "pathname"=> "watch",
            "position"=> "nav",
            "settings"=> ['widgets'=>[]],
        ]);

        $stock = ProductStock::with('product')->where('sku', '=', 'iphone616-gray')->first();
        $order = Order::create([
            'logistics_consignee' => 'Garbin Huang',
            'logistics_region' => ['福建', '福州', '仓山区'],
            'logistics_address' => '福湾新城春风苑2区6号楼802',
            'logistics_zipcode' => '3500001',
            'logistics_mobile' => '18610073651',
            'logistics_phone' => '',
            'logistics_email' => 'garbinh@gmail.com',
            'logistics_id' => 1,
            'logistics_cod' => false,
            'logistics_tracking_number' => '',
            'payment_id' => 1,
            'user_id'    => 1,
            ]);
        $order_products = [new OrderProduct([
                'product_id' => $stock->product->id,
                'product_name' => $stock->product->product_name,
                'sku' => $stock->sku,
                'option' => $stock->option,
                'price' => $stock->price,
                'quantity' => 1,
                'custom_info' => [],
            ])];
        $order->calc($order_products);
        $order->save();
        $order_product = $order->products()->saveMany($order_products);

        // Test Order
        $stock = ProductStock::with('product')->where('sku', '=', 'iphone616-gold')->first();
        $order = Order::create([
            'logistics_consignee' => 'Garbin Huang',
            'logistics_region' => ['福建', '福州', '仓山区'],
            'logistics_address' => '福湾新城春风苑2区6号楼802',
            'logistics_zipcode' => '3500001',
            'logistics_mobile' => '18610073651',
            'logistics_phone' => '',
            'logistics_email' => 'garbinh@gmail.com',
            'logistics_id' => 1,
            'logistics_cod' => true,
            'logistics_tracking_number' => '',
            'payment_id' => 1,
            'user_id'    => 1,
            ]);
        $order_products = [new OrderProduct([
                'product_id' => $stock->product->id,
                'product_name' => $stock->product->product_name,
                'sku' => $stock->sku,
                'option' => $stock->option,
                'price' => $stock->price,
                'quantity' => 1,
                'custom_info' => [],
            ])];
        $order->calc($order_products);
        $order->save();
        $order_product = $order->products()->saveMany($order_products);

        $this->command->info('Test Data seeded');
    }
}
