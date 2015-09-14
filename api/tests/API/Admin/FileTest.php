<?php namespace Tests\API\Admin;

use Image;
use App\Models\Page;
use TestCase;

class FileTest extends TestCase
{
    public function setUp()
    {
        parent::setUp();
        $this->resetEvents('App\Models\UploadFile');
    }

    public function testStore()
    {
        $this->post(route('api.admin.file.index'), json_encode([
            'file' => (string)Image::make(base_path('tests/API/data/iphone6-select-2014_GEO_CN.png'))->encode('data-url'),
            'file_name' => 'iphone6-select-2014_GEO_CN.png',
        ]));

        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertResponseStatus(201);

        return $this->response->original;
    }

    /** @depends testStore */
    public function testShow($file)
    {
        $this->get(route('api.admin.file.item', $file));
        // $this->assertSame($page->title, $this->response->original->title);
        $this->assertEquals($file->file_type, $this->response->headers->get('content-type'));
        $this->assertResponseOk();
    }

    /** @depends testStore */
    public function testIndex($file)
    {
        $this->get(route('api.admin.file.index'));
        $this->assertInternalType('array', $this->response->original);
        $this->assertResponseOk();
    }


    /** @depends testStore*/
    public function testDestroy($file)
    {
        $this->delete(route('api.admin.file.item', $file));
        $this->assertResponseStatus(204);
    }
}
