<?php namespace Tests\Models;

use TestCase;
use App\Models\Logistics;
use App\Libraries\Interfaces\Deliverer;
use App\Libraries\Logistics\Package;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class LogisticsTest extends TestCase
{
    public function setUp()
    {
        parent::setUp();
        $attributes = [
            'logistics_name' => '测试运送',
            'status' => 'enabled',
            'logistics_desc' => '电铺的测试运送',
            'deliverer_name' => '\\App\\Plugins\\Offical\\Deliverers\\Simple',
            'deliverer_settings' => [
                'effective' => '全国下一个工作日到货',
                'price'     => 10,
            ]
        ];
        $this->logistics = new Logistics($attributes);
        $this->logistics->save();
        $this->package   = new Package();
        $this->package->add(1);
    }

    public function testDeliverer()
    {
        $this->assertTrue($this->logistics->deliverer instanceof Deliverer);
    }

    public function testCalc()
    {
        $this->assertEquals(10, $this->logistics->deliverer->calc($this->package));
    }


    public function tearDown()
    {
        $this->logistics->delete();
    }
}
