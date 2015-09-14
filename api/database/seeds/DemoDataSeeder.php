<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Models\Logistics;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductPhoto;
use App\Models\ProductStock;
use App\Models\UploadFile;
use App\Models\Page;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
        File::cleanDirectory(storage_path() . '/app');

        // Logistics
        $logistics = Logistics::create(array(
            'logistics_name' => 'Free Shipping',
            'status' => 'enabled',
            'logistics_desc' => 'Free Shipping',
            'deliverer_name' => '\App\Plugins\Offical\Deliverers\Simple',
            'deliverer_settings' => array(
                'effective' => '1-2 days',
                'price'     => 0,
            ),
            'deliverer_cod' => array(),
        ));
        $payment = Payment::create(array(
            'payment_name' => 'Paypal',
            'status' => 'enabled',
            'payment_desc' => 'Paypal',
            'gateway_name' => '\App\Plugins\Offical\Payments\Paypal\Main',
            'gateway_settings' => array(
                'username' => 'garbinh-facilitator_api1.gmail.com',
                'password' => '35RQL3NH8CN5JAFS',
                'signature' => 'An5ns1Kso7MWUdW4ErQKJJJ4qi4-ASi8mA4dnxkI-AikSA9AZVvSERfE',
            ),
        ));
        $models = $this->createProduct([
            'product_name' => 'Tesla Model S',
            'status' => 'available',
            'product_desc' => '',
            'options' => array(
                ['name'=>'Paint', 'options'=>['Solid Black', 'Solid White', 'Red']],
                ['name'=>'Roof', 'options'=>['Body Color Roof', 'Glass Roof']],
                ['name'=>'Battery', 'options'=>['70D', '85D', 'P85D']],
            ),
            'specifications' => []
        ], [
            'dir' => 'models',
            'files' => File::files(database_path() . '/seeds/demo/models')
        ], [
            '70d' => [
                'option' => ['Solid Black', 'Body Color Roof', '70D'],
                'price'  => 75000,
                'cover'  => 'black.png',
            ],
            '85d' => [
                'option' => ['Solid White', 'Body Color Roof', '85D'],
                'price'  => 85000,
                'cover' => 'white.png',
            ],
            'p85d' => [
                'option' => ['Red', 'Glass Roof', 'P85D'],
                'price'  => 108000,
                'cover'  => 'red.png',
            ]
        ]);

        $watch = $this->createProduct([
            'product_name' => 'Apple Watch',
            'status' => 'available',
            'product_desc' => '',
            'options' => array(
                ['name'=>'Size', 'options'=>['38mm', '48mm']],
                ['name'=>'Case', 'options'=>['Silver Aluminum', 'Stainless Steel']],
                ['name'=>'Band', 'options'=>['White Sport Band', 'Black Sport Band', 'Black Classic Buckle', 'Milanese Loop', 'Black Modern Buckle', 'Link Bracelet']],
            ),
            'specifications' => []
        ], [
            'dir' => 'watch',
            'files' => File::files(database_path() . '/seeds/demo/watch'),
        ], [
            [
                'option' => ['38mm', 'Stainless Steel', 'White Sport Band'],
                'price'  => 549,
                'cover'  => 'w38ss-sbwh-sel.jpg',
            ],
            [
                'option' => ['42mm', 'Stainless Steel', 'Black Sport Band'],
                'price'  => 599,
                'cover'  => 'w42ss-sbbk-sel.jpg',
            ],
            [
                'option' => ['38mm', 'Stainless Steel', 'Black Classic Buckle'],
                'price'  => 649,
                'cover'  => 'w38ss-cbbk-sel.jpg',
            ],
            [
                'option' => ['42mm', 'Stainless Steel', 'Milanese Loop'],
                'price'  => 699,
                'cover'  => 'w42ss-ml-sel_GEO_US.jpg',
            ],
            [
                'option' => ['38mm', 'Stainless Steel', 'Black Modern Buckle'],
                'price'  => 749,
                'cover'  => 'w38ss-mbbk-sel.jpg',
            ],
            [
                'option' => ['42mm', 'Stainless Steel', 'Link Bracelet'],
                'price'  => 999,
                'cover'  => 'w42ss-slsi-sel.jpg',
            ],
        ]);

        $files = [];
        foreach (File::files(database_path() . '/seeds/demo/pages') as $path) {
            $filename = basename($path);
            $files[$filename] = UploadFile::create(array(
                'file' => (string)Image::make($path)->encode('data-url'),
                'file_name' => $filename,
            ));
        }

        Page::create([
            'title' => 'Index',
            'pathname' => 'index',
            'position' => 'index',
            'settings' => [
                'widgets' => [
                    [
                        'widget' => 'Offical.Slider',
                        'style' => ['padding' => '0px'],
                        'data'   => [
                            '<div class="slide-item" style="background-image:url(' . $files['slider.models.jpg']->file_path . ');background-size:cover;">
                                <div style="position:relative;left:50%;width:50%;height:100%;">
                                    <div style="position: relative;top: 10%;left: -50%;width: 100%;">
                                        <h1>
                                            TESLA&reg; Model S
                                        </h1>
                                        <p class="lead">
                                            Highest safety rating in America<br />
                                            Autopilot equipped<br />
                                            Available All-Wheel Drive Dual Motor<br />
                                            Zero to 60 mph in as little as 2.8 seconds<br />
                                            Up to 270 miles range (EPA)<br />
                                            <a href="/models">Learn More</a>
                                        </p>
                                    </div>
                                </div>
                            </div>',
                            '<div class="slide-item" style="background-image:url(' . $files['slider.watch.png']->file_path . ');background-size:692px 224px;">
                                <div style="position:relative;left:50%;width:50%;height:100%;">
                                    <div style="text-align:center; position: relative;top: 10%;left: -50%;width: 100%;">
                                        <h1 style="font-size:4em;"><i class="ion-social-apple"></i>&nbsp;WATCH</h1>
                                        <p class="lead" style="font-size:2em">The Watch is <a href="/watch">here</a></p>
                                    </div>
                                </div>
                            </div>'
                        ]
                    ]
                ]
            ],
        ]);
        Page::create([
            'title' => 'Buy Models',
            'pathname' => 'models/buy',
            'position' => 'models',
            'settings' => [
                'button'  => [
                    'className' => 'btn btn-primary btn-sm',
                    'text' => 'Buy Now',
                ],
                'widgets' => [
                    [
                        'widget' => 'Offical.Header',
                        'id' => '#models_header',
                        'data'   => [
                            'title' => '<a href="/models">TESLA Model S</a>',
                            'position' => 'models',
                        ]
                    ],
                    [
                        'widget' => 'Offical.ProductPicker',
                        'data'   => ['product_id' => 1],
                    ],
                    [
                        'widget' => 'Offical.PureHTML',
                        'style'  => ['background' => 'whitesmoke'],
                        'data'   => '<div class="container text-center" style="width:65%">
                                        <div>
                                        <h1>Battery, Performance, and Drive options</h1>
                                        <p class="lead">Every Model S includes free long distance travel using Tesla\'s Supercharger network and an eight year, infinite mile battery and drive warranty.</p>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-4">
                                                <div style="background-color:white;border:1px solid #cccccc;text-align:left;height:400px;">
                                                    <h1 class="text-center"><span style="color:#aaa;">70</span><strong>D</strong></h1>
                                                    <ol style="list-style:none;padding:15px;">
                                                        <li style="text-align: center;margin-top: -20px;padding-bottom: 20px;border-bottom: 1px solid #ccc;margin-bottom: 20px;"><strong>All-Wheel Drive</strong></li>
                                                        <li class="package-detail">70 kWh battery with all-wheel drive</li>
                                                        <li class="package-detail"><strong>240</strong> miles range (EPA)</li>
                                                        <li class="package-detail"><strong>5.2</strong> seconds 0-60 mph</li>
                                                        <li class="package-detail"><strong>13.5</strong> seconds ¼ mile</li>
                                                        <li class="package-detail"><strong>328</strong> hp<br>
                                                        <strong>259</strong> hp front and rear motor power</li>
                                                        <li class="package-detail"><strong>387</strong> lb-ft motor torque</li>
                                                        <li class="package-detail"><strong>140</strong> mph top speed</li>
                                                    </ol>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div style="background-color:white;border:1px solid #cccccc;text-align:left;height:400px;">
                                                    <h1 class="text-center"><span style="color:#aaa;">85</span><strong>D</strong></h1>
                                                    <ol style="list-style:none;padding:15px;">
                                                        <li style="text-align: center;margin-top: -20px;padding-bottom: 20px;border-bottom: 1px solid #ccc;margin-bottom: 20px;"><strong>All-Wheel Drive</strong></li>
                                                        <li>85 kWh battery with all-wheel drive<br>
                                                        90 kWh upgrade increases range 6%</li>
                                                        <li><strong>270</strong> miles range (EPA)</li>
                                                        <li><strong>4.2</strong> seconds 0-60 mph</li>
                                                        <li><strong>12.5</strong> seconds ¼ mile</li>
                                                        <li><strong>417</strong> hp <br>
                                                        <strong>259</strong> hp front and rear motor power</li>
                                                        <li><strong>485</strong> lb-ft motor torque</li>
                                                        <li><strong>155</strong> mph top speed</li>
                                                    </ol>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div style="background-color:white;border:1px solid #cccccc;text-align:left;height:400px;">
                                                    <h1 class="text-center"><span style="color:red;font-weight:bold;">P</span><span style="color:#aaa;">85</span><strong style="color:red;">D</strong></h1>
                                                    <ol style="list-style:none;padding:15px;">
                                                        <li style="text-align: center;margin-top: -20px;padding-bottom: 20px;border-bottom: 1px solid #ccc;margin-bottom: 20px;"><strong>Performance All-Wheel Drive</strong></li>
                                                        <li>85 kWh battery with all-wheel drive<br>
                                                        90 kWh upgrade increases range 6%</li>
                                                        <li><strong>253</strong> miles range (EPA)</li>
                                                        <li><strong>3.1</strong> seconds 0-60 mph<br>
                                                        <strong>2.8</strong> seconds 0-60 mph with Ludicrous Speed Upgrade</li>
                                                        <li><strong>10.9</strong> seconds ¼ mile with Ludicrous Speed Upgrade</li>
                                                        <li><strong>259</strong> hp front motor power <br>
                                                        <strong>503</strong> hp rear motor power</li>
                                                        <li><strong>713</strong> lb-ft motor torque</li>
                                                        <li><strong>155</strong> mph top speed</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                     </div>'
                    ],
                ],
            ]
        ]);
        Page::create([
            'title' => 'Model S',
            'pathname' => 'models',
            'position' => 'nav',
            'settings' => [
                'effect' => [
                    'name' => 'scrollmagic',
                    'pins' => [
                        [
                            'element' => '#models_header',
                            'scene' => ['offset' => 50],
                            'settings' => ['pushFollowers' => false]
                        ]
                    ],
                ],
                'widgets' => [
                    [
                        'widget' => 'Offical.Header',
                        'id' => 'models_header',
                        'data'   => [
                            'title' => 'TESLA Model S',
                            'position' => 'models',
                        ]
                    ],
                    [
                        'style'  => ['padding' => '0px', 'marginTop' => '-50px'],
                        'widget' => 'Offical.PureHTML',
                        'data'   => '<div style="height:674px; background-image:url('. $files['models.section.jpg']->file_path .');background-size:cover;">
                                        <div style="position:relative;left:50%;width:50%;height:100%;">
                                            <div style="position: relative;top: 15%;left: -50%; color:white; width: 100%; text-align:right">
                                                <p class="lead" style="font-size:1.5em">
                                                    Highest safety rating in America<br />
                                                    Autopilot equipped<br />
                                                    Available All-Wheel Drive Dual Motor<br />
                                                    Zero to 60 mph in as little as 2.8 seconds<br />
                                                    Up to 270 miles range (EPA)
                                                </p>
                                            </div>
                                        </div>
                                    </div>'
                    ],
                    [
                        'widget' => 'Offical.PureHTML',
                        'data'   => '<div class="text-center container" style="width:55%">
                                        <h1>Zero Emissions. Zero Compromises.</h1>
                                        <p class="lead" style="font-size:1.2em">
                                            Tesla’s advanced electric powertrain delivers exhilarating performance. Unlike a gasoline internal combustion engine with hundreds of moving parts, Tesla electric motors have only one moving piece: the rotor. As a result, Model S acceleration is instantaneous, silent and smooth. Step on the accelerator and in as little as 2.8 seconds Model S is travelling 60 miles per hour, without hesitation, and without a drop of gasoline. Model S is an evolution in automobile engineering.
                                        </p>
                                    </div>'
                    ],
                    [
                        'widget' => 'Offical.PureHTML',
                        'style'  => ['background' => 'white'],
                        'data'   => '<div class="text-center">
                                        <figure>
                                            <video type="video/mp4" src="http://www.teslamotors.com/sites/default/files/images/model-s/videos/powertrain-dualmotor-p85d.mp4" class="media-element media-video" autoplay="" loop=""></video>
                                        </figure>
                                        <div class="container" style="width:55%">
                                            <h1>All-Wheel Drive Dual Motor</h1>
                                            <p class="lead">
                                                Dual Motor Model S is a categorical improvement on conventional all-wheel drive systems. With two motors, one in the front and one in the rear, Model S digitally and independently controls torque to the front and rear wheels. The result is unparalleled traction control in all conditions.
                                            </p>
                                        </div>
                                    </div>'
                    ],
                    [
                        'widget' => 'Offical.ImageParkText',
                        'style'  => ['background' => 'whitesmoke'],
                        'data'   => [
                            'text' => [
                                'title' => 'Zero profile door handles',
                                'subtitle' => 'Model S door handles are a work of art. When a key is in close proximity, they automatically extend. When no longer in use, they retract into the body of the car, creating a seamless surface for air to pass over.'
                            ],
                            'img'  => ['src' => $files['models.door-handles-black.jpg']->file_path ],
                        ]
                    ],
                    [
                        'widget' => 'Offical.ImageParkText',
                        'style'  => ['background' => 'white'],
                        'data'   => [
                            'text' => [
                                'title' => 'Hidden in plain sight',
                                'subtitle' => 'Scan the streamlined body panels and you\'ll discover that Model S lacks a fuel door. Approach the driver\'s side taillight with a charging connector and the hidden charge port automatically opens. The charging connector cannot be removed until Model S is unlocked.'
                            ],
                            'img'  => ['src' => $files['models.charging-default.jpg']->file_path ],
                        ]
                    ],
                    [
                        'widget' => 'Offical.Slider',
                        'style' => ['padding' => '0px'],
                        'settings' => ['indicators' => false, 'className' => 'carousel-fade'],
                        'data'   => [
                            '<figure>
                                <img src="' . $files['models.gallery.1.jpg']->file_path . '" />
                             </figure>',
                            '<figure>
                                <img src="' . $files['models.gallery.2.jpg']->file_path . '" />
                             </figure>',
                            '<figure>
                                <img src="' . $files['models.gallery.3.jpg']->file_path . '" />
                             </figure>',
                            '<figure>
                                <img src="' . $files['models.gallery.4.jpg']->file_path . '" />
                             </figure>',
                            '<figure>
                                <img src="' . $files['models.gallery.5.jpg']->file_path . '" />
                             </figure>',
                            '<figure>
                                <img src="' . $files['models.gallery.6.jpg']->file_path . '" />
                             </figure>',
                            '<figure>
                                <img src="' . $files['models.gallery.7.jpg']->file_path . '" />
                             </figure>',
                            '<figure>
                                <img src="' . $files['models.gallery.8.jpg']->file_path . '" />
                             </figure>',
                            '<figure>
                                <img src="' . $files['models.gallery.9.jpg']->file_path . '" />
                             </figure>',
                        ]
                    ],
                    [
                        'widget' => 'Offical.ImageParkText',
                        'style'  => ['background' => 'whitesmoke'],
                        'data'   => [
                            'text' => [
                                'title' => 'Exquisite materials',
                                'subtitle' => 'Every surface, seam, and stitch is a carefully considered balance between tactile, visual, and environmental friendliness. Door handles are made from hand polished zinc, the leather trim uses premium Nappa leather, and décor pieces are minimally finished to preserve their natural beauty. Materials are sourced as close to our California factory as possible to reduce the environmental impact of transporting them long distances.'
                            ],
                            'img'  => ['src' => $files['models.obeche-matte-yacht-floor.jpg']->file_path ],
                        ]
                    ],
                    [
                        'widget' => 'Offical.ImageParkText',
                        'style'  => ['background' => 'white'],
                        'data'   => [
                            'text' => [
                                'title' => 'The touchscreen',
                                'subtitle' => 'The Model S 17 inch touchscreen controls most of the car\'s functions. Opening the all glass panoramic roof, customizing the automatic climate control, and changing the radio station all happen with a swipe or a touch. The touchscreen, digital instrument cluster, and steering wheel controls seamlessly integrate media, navigation, communications, cabin controls and vehicle data.'
                            ],
                            'img'  => '<iframe src="//player.vimeo.com/video/61821553" width="430" height="240" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>',
                        ]
                    ],
                    [
                        'widget' => 'Offical.PureHTML',
                        'style'  => ['background' => 'whitesmoke'],
                        'data'   => '<div class="container text-center">
                                        <a href="/models/buy" class="btn btn-lg btn-danger">GET YOUR MODEL S NOW</a>
                                    </div>'
                    ],
                ],
            ]
        ]);
        Page::create([
            'title' => 'Buy Watch',
            'pathname' => 'watch/buy',
            'position' => 'watch',
            'settings' => [
                'button'  => [
                    'className' => 'btn btn-primary btn-sm',
                    'text' => 'Buy',
                ],
                'effect' => [
                    'name' => 'scrollmagic',
                    'pins' => [
                        [
                            'element' => '#watch_header',
                            'scene' => ['offset' => 50],
                            'settings' => ['pushFollowers' => false]
                        ]
                    ],
                ],
                'widgets' => [
                    [
                        'widget' => 'Offical.Header',
                        'id' => 'watch_header',
                        'data'   => [
                            'title' => '<a href="/watch"><i class="ion-social-apple"></i>&nbsp;WATCH</a>',
                            'position' => 'watch',
                        ]
                    ],
                    [
                        'widget' => 'Offical.ProductSelector',
                        'data'   => [
                            'product_id' => 2,
                            'title' => '<i class="ion-social-apple"></i>&nbsp;WATCH',
                            'template' => '${option[0]} ${option[1]} Case with ${option[2]}',
                        ],
                    ],
                    [
                        'widget' => 'Offical.ImageParkText',
                        'style'  => ['background' => 'white', 'padding' => '0px', 'borderTop' => '1px solid #ccc'],
                        'data'   => [
                            'text' => [
                                'title' => 'Stainless steel case.',
                                'subtitle' => 'The case is crafted from a refined 316L stainless steel that’s been cold forged, making it up to 80 percent harder. It’s less susceptible to nicks and corrosion and has a beautiful mirror finish.'
                            ],
                            'img'  => ['src' => $files['watch.watch-case-bb-201504a.jpeg']->file_path ],
                        ]
                    ],
                    [
                        'widget' => 'Offical.ImageParkText',
                        'style'  => ['background' => 'white', 'padding' => '0px', 'borderTop' => '1px solid #ccc'],
                        'data'   => [
                            'text' => [
                                'title' => 'Sapphire crystal display.',
                                'subtitle' => 'The display is protected by ultra-hard, polished, precision-machined sapphire crystal.'
                            ],
                            'img'  => ['src' => $files['watch.watch-display-bb-201504a.jpeg']->file_path ],
                        ]
                    ],
                    [
                        'widget' => 'Offical.ImageParkText',
                        'style'  => ['background' => 'white', 'padding' => '0px', 'borderTop' => '1px solid #ccc'],
                        'data'   => [
                            'text' => [
                                'title' => 'Fine leather, durable fluoroelastomer, and polished stainless steel bands.',
                                'subtitle' => 'Choose from three different leather bands, a high-performance fluoroelastomer band, a link bracelet, and a Milanese loop.'
                            ],
                            'img'  => '<img src="'. $files['watch.watch-band-static-bb-201504a.jpeg']->file_path .'" style="max-height:575px" />',
                        ]
                    ],
                ]
            ]
        ]);

        Page::create([
            'title' => 'Watch',
            'pathname' => 'watch',
            'position' => 'nav',
            'settings' => [
                // 'effect' => [
                //     'name' => 'scrollmagic',
                //     'pins' => [
                //         [
                //             'element' => '#watch_header',
                //             'scene' => ['offset' => 50],
                //             'settings' => ['pushFollowers' => false]
                //         ]
                //     ],
                // ],
                'widgets' => [
                    [
                        'widget' => 'Offical.Header',
                        'id' => 'watch_header',
                        'style' => ['background' => 'transparent', 'color' => '#fff', 'fontWeight' => 'bold'],
                        'data'   => [
                            'title' => '<i class="ion-social-apple"></i>&nbsp;WATCH',
                            'position' => 'watch',
                        ]
                    ],
                    [
                        'widget' => 'Offical.Slider',
                        'style' => ['padding' => '0px', 'marginTop' => '-50px'],
                        'settings' => ['indicators' => false, 'className' => 'carousel-fade', 'controls' => false, 'pauseOnHover' => false],
                        'data'   => [
                            '<div style="position:relative;">
                                <div style="position:absolute; top:15%; width:100%; left:0; text-align:center; font-size: 4em; font-weight:100; color:white">
                                    Notifications. Activity. Siri. Apple Pay.
                                    <br />Right on your wrist.
                                </div>
                                <figure>
                                    <img src="' . $files['watch.hero_dance_large_2x.jpg']->file_path . '" />
                                </figure>
                            </div>',
                            '<div style="position:relative;">
                                <div style="position:absolute; top:15%; width:100%; left:0; text-align:center; font-size: 4em; font-weight:100; color:white">
                                    Notifications. Activity. Siri. Apple Pay.
                                    <br />Right on your wrist.
                                </div>
                                <figure>
                                    <img src="' . $files['watch.hero_sunset_large_2x.jpg']->file_path . '" />
                                </figure>
                            </div>',
                            '<div style="position:relative;">
                                <div style="position:absolute; top:15%; width:100%; left:0; text-align:center; font-size: 4em; font-weight:100; color:white">
                                    Notifications. Activity. Siri. Apple Pay.
                                    <br />Right on your wrist.
                                </div>
                                <figure>
                                    <img src="' . $files['watch.hero_kiss_large_2x.jpg']->file_path . '" />
                                </figure>
                            </div>',
                        ],
                    ],
                    [
                        'widget' => 'Offical.PureHTML',
                        'style' => ['padding' => '0px'],
                        'data' => '<div style="background:#f2f2f2">
                                    <div class="container text-center">
                                        <h1>Our most personal device yet.</h1>
                                        <p class="lead" style="width:60%;margin:auto">To make the best use of its size and location on your wrist, Apple Watch has all-new interactions and technologies. They let you do familiar things more quickly and conveniently. As well as some things that simply weren’t possible before. So using it is a whole new experience. One that’s more personal than ever.</p>
                                    </div>
                                    <figure>
                                    <img src="' . $files['watch.technology_hero_large_2x.jpg']->file_path . '" />
                                    </figure>
                                   </div>'
                    ],
                    [
                        'widget' => 'Offical.PureHTML',
                        'style' => ['background' => 'white', 'padding' => '0px'],
                        'data' => '<div style="overflow:hidden;">
                                    <div class="container text-center">
                                        <h1>An incredibly precise timepiece.</h1>
                                        <p class="lead" style="width:60%;margin:auto">High-quality watches have long been defined by their ability to keep unfailingly accurate time, and Apple Watch is no exception. In conjunction with your iPhone, it keeps time within 50 milliseconds of the definitive global time standard. It even lets you customize your watch face to present time in a more meaningful, personal context that’s relevant to your life and schedule.</p>
                                    </div>
                                    <figure style="position:relative; margin-top:30px; margin-bottom:-500px; width:711px; height:898px; margin-left:auto; margin-right:auto; background-image:url(' . $files['watch.timekeeping_hero_large_2x.jpg']->file_path . '); background-size:711px 898px;">
                                    </figure>
                                   </div>'
                    ],
                    [
                        'widget' => 'Offical.PureHTML',
                        'style' => ['padding' => '0px'],
                        'data' => '<div style="background:#f2f2f2">
                                    <div class="container text-center">
                                        <h1>Entirely new ways to stay in touch.</h1>
                                        <p class="lead" style="width:60%;margin:auto">Apple Watch makes all the ways you’re used to communicating more convenient. And because it sits right on your wrist, it can add a physical dimension to alerts and notifications. For example, you’ll feel a gentle tap with each incoming message. Apple Watch also lets you connect with your favorite people in fun, spontaneous ways — like sending a tap, a sketch, or even your heartbeat.</p>
                                    </div>
                                    <figure>
                                    <img src="' . $files['watch.communication_hero_large_2x.jpg']->file_path . '" />
                                    </figure>
                                   </div>'
                    ],
                    [
                        'widget' => 'Offical.PureHTML',
                        'style' => ['background' => 'white', 'padding' => '0px'],
                        'data' => '<div style="overflow:hidden;">
                                    <div class="container text-center">
                                        <h1>A smarter way to look at fitness.</h1>
                                        <p class="lead" style="width:60%;margin:auto">Apple Watch gives you a complete picture of your all-day activity. The three rings of the Activity app show your daily progress and help motivate you to sit less, move more, and get some exercise. It’s also an advanced sports watch, giving you real-time stats for a variety of the most popular workouts. Over time, Apple Watch learns your activity and fitness levels. It uses that information to improve the accuracy of your measurements and suggest personalized all-day activity goals. It even provides custom reminders to encourage you to achieve them.</p>
                                    </div>
                                    <figure style="position:relative; margin-top:30px; margin-bottom:-400px; width:1035px; height:931px; margin-left:auto; margin-right:auto; background-image:url(' . $files['watch.health_hero_large_2x.jpg']->file_path . '); background-size:1035px 931px;">
                                    </figure>
                                   </div>'
                    ],
                ]
            ]
        ]);

        $this->command->info('Demo data seeded!');
    }

    public function createProduct($_product, $_photos, $_stocks)
    {
        $product = Product::create($_product);
        $product->save();

        $photos = [];
        foreach ($_photos['files'] as $_file) {
            $photos[basename($_file)] = $product->photos()->create([
                "sort_index" => 0,
                "file"     => [
                    "file_name" => basename($_file),
                    "file_path" => (string)Image::make($_file)->encode('data-url')
                ]
            ]);
        }
        $stocks = [];
        foreach ($_stocks as $key => $_stock) {
            $cover_id = $photos[$_stock['cover']]->id;
            $stocks[$key] = $product->stocks()->create([
                'sku' => uniqid(),
                'option' => $_stock['option'],
                'stocks' => 100,
                'price'  => $_stock['price'],
                'cover_id' => $cover_id,
            ]);
        }

        return $product;
    }
}
