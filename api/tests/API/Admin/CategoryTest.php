<?php namespace Tests\API\Admin;

use TestCase;
use App\Models\Category;

class CategoryTest extends TestCase {
    public function setUp()
    {
        parent::setUp();
        $this->resetEvents('App\Models\Category');
    }

    public function testStore()
    {
        $this->post(route('api.admin.category.index'), json_encode([
            'category_name' => 'test',
            'parent_id' => 0
            ]));
        $this->assertResponseStatus(201);
        $category = $this->response->original;
        $this->post(route('api.admin.category.index'), json_encode([
            'category_name' => 'test child',
            'parent_id' => $category->id
            ]));
        $this->assertResponseStatus(201) ;

        return $category;
    }

    /**
     * @depends testStore
     */
    public function testUpdate($category)
    {
        $this->put(route('api.admin.category.item', $category), json_encode([
            'category_name' => 'test edited',
            ]));
        $category = Category::find($category->id);
        $this->assertEquals('test edited', $category->category_name);
        $this->assertResponseOk();
    }

    /**
     * @depends testStore
     */
    public function testTree($category)
    {
        $this->get(route('api.admin.category.tree'));
        $this->assertArrayHasKey('children', $this->response->original[0]);
        $this->assertResponseOk();
    }

    /**
     * @depends testStore
     */
    public function testIndex($category)
    {
        $this->get(route('api.admin.category.index'));
        $this->assertResponseOk();
        $this->get(route('api.admin.category.index', ['parent_id' => $category->id]));
        $this->assertResponseOk();
    }

    /**
     * @depends testStore
     */
    public function testDestroy($category)
    {
        $reponse = $this->delete(route('api.admin.category.item', $category));
        $this->assertResponseStatus(204);
    }

    public function testRelatedDelete()
    {
        $this->post(route('api.admin.category.index'), json_encode([
            'category_name' => 'top',
            'parent_id' => 0
            ]));
        $this->assertResponseStatus(201);
        $top = $this->response->original;
        $this->post(route('api.admin.category.index'), json_encode([
            'category_name' => 'second',
            'parent_id' => $top->id
            ]));
        $second = $this->response->original;
        $this->assertResponseStatus(201) ;
        $this->post(route('api.admin.category.index'), json_encode([
            'category_name' => 'third',
            'parent_id' => $second->id
            ]));
        $third  = $this->response->original;
        $this->assertResponseStatus(201) ;
        $reponse = $this->delete(route('api.admin.category.item', $top));
        $this->assertResponseStatus(204);
        $this->get(route('api.admin.category.item', $top));
        $this->assertResponseStatus(404);
        $this->get(route('api.admin.category.item', $second));
        $this->assertResponseStatus(404);
        $this->get(route('api.admin.category.item', $third));
        $this->assertResponseStatus(404);
    }
}
