<?php namespace Tests\API;

use App\Models\Page;
use TestCase;

class PageTest extends TestCase
{

    public function testIndex()
    {
        $this->get(route('api.page.index', ['f'=>['position'=>'not_exists']]));
        $this->assertEmpty($this->response->original);
        $this->assertResponseOk();
        $this->get(route('api.page.index', ['f'=>['position'=>'index']]));
        $this->assertNotEmpty($this->response->original);
        $this->assertResponseOk();
    }

    public function testPathname()
    {
        $this->get(route('api.page.pathname', ['pathname'=>'index']));
        $this->assertEquals('index', $this->response->original->position, $this->response->getContent());
        $this->assertResponseOk();
    }
}
