<?php namespace Tests\API\Admin;

use App\Models\Page;
use TestCase;

class PageTest extends TestCase
{
    public function testStore()
    {
        $this->post(route('api.admin.page.index'), json_encode([
            "title"=> "首页轮播",
            "pathname"=> "/",
            "position"=> "index",
            "settings"=> ['widgets'=>[]],
        ]));

        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertEquals("首页轮播", $this->response->original->title, $this->response->getContent());
        $this->assertResponseStatus(201);

        return $this->response->original;
    }

    /** @depends testStore */
    public function testShow($page)
    {
        $this->get(route('api.admin.page.item', $page));
        $this->assertSame($page->title, $this->response->original->title);
        $this->assertResponseOk();
    }

    /** @depends testStore */
    public function testIndex($page)
    {
        $this->get(route('api.admin.page.index'));
        $this->assertInternalType('array', $this->response->original);
        $this->assertResponseOk();
    }


    /** @depends testStore*/
    public function testDestroy($page)
    {
        $this->delete(route('api.admin.page.item', $page));
        $this->assertResponseStatus(204);
    }
    // public function testComponents()
    // {
    //     $this->get(route('api.admin.page.plugins'));
    //     $this->assertInternalType('array', $this->response->original, $this->response->getContent());
    //     $this->assertArrayHasKey('plugin', $this->response->original[0], $this->response->getContent());
    //     $this->assertResponseOk();
    // }
}
