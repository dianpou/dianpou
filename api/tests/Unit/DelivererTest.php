<?php namespace Test\Unit;

use TestCase;
use App\Models\Order;
use App\Plugins\Offical\Deliverers\Simple;
use App\Libraries\Logistics\Package;
use App\Libraries\Form;

class DelivererTest extends TestCase {
    public function setUp()
    {
        $this->deliverer = new Simple([
            'effective' => '1到三个工作日',
            'price'     => 5,
        ]);
        $this->package = new Package();
    }

    public function testPackage()
    {
        $this->package->add([
            'product' => 'iPhone 6 Plus',
            'quantity'     => 1,
            'weight'       => 481,
            'volume'       => [17.6, 9.6, 4.6],
        ]);
        $this->package->to(['北京', '北京', '朝阳区']);
        $this->assertEquals(1, $this->package->getQuantity());
        $this->assertEquals(481, $this->package->getWeight());
        $this->assertEquals(777, $this->package->getVolume());
        $this->assertEquals(['北京', '北京', '朝阳区'], $this->package->getDestination());

        return $this->package;
    }

    /** @depends testPackage */
    public function testCalc($package)
    {
        $this->assertEquals(5, $this->deliverer->calc($package));
    }


    /** @depends testPackage */
    public function testShip()
    {
        $this->assertEquals(false, $this->deliverer->ship($this->package));
    }

    public function testGetDelivererSettingsForm()
    {
        $this->assertEquals([
            'effective' => [
                'type' => Form::TEXT,
                'label'=> '时效',
            ],
            'price' => [
                'type' => Form::TEXT,
                'label'=> '单价',
            ],
        ], $this->deliverer->settings->form());
    }
}
