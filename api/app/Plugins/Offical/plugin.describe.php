<?php

return [
    'name' => 'Dianpou Offical Plugin',
    'desc' => 'Dianpou Offical Plugin',
    'author' => '<Garbin Huang> garbinh@gmail.com',
    'version' => '0.1.0',
    'components' => [
        'deliverers' => [
            '\App\Plugins\Offical\Deliverers\Simple' => [
                'name' => '按件计费',
            ]
        ],
        'payments' => [
            '\App\Plugins\Offical\Payments\Alipay\Main' => [
                'name' => 'Alipay',
            ],
            '\App\Plugins\Offical\Payments\Paypal\Main' => [
                'name' => 'Paypal',
            ]
        ],
        'Widgets' => [
            'Slider' => [
                'name' => '轮播',
            ]
        ]
    ]
];
