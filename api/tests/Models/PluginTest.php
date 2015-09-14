<?php namespace Tests\Models;

use TestCase;
use App\Models\Plugin;

class PluginTest extends TestCase
{
    public function testAvaiable()
    {
        $this->assertArrayHasKey('Offical', Plugin::available());
    }

    public function testAvailableComponents()
    {
        $deliverers = Plugin::available('deliverers');
        $this->assertArrayHasKey('\App\Plugins\Offical\Deliverers\Simple', $deliverers);
        $this->assertArrayHasKey('settings_form', $deliverers['\App\Plugins\Offical\Deliverers\Simple']);
    }
}