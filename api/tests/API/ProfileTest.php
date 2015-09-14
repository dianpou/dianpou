<?php namespace Tests\API;

use TestCase;
class ProfileTest extends TestCase {
    public function setUp()
    {
        parent::setUp();
        $this->headers = [
            'Authorization' => 'SyjKhdQ1JcKs1S6X18VQW2LaTclJYzW4AC1dfkFk',
            ];
    }

    public function testIndex()
    {
        $this->get(route('api.profile'));
        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertResponseOk();
    }

    public function testUpdate()
    {
        $this->put(route('api.profile'), json_encode([
            'name' => 'Garbin'
            ]));
        $this->assertSame('Garbin', $this->response->original->name, $this->response->getContent());
        $this->assertResponseOk();
    }
}
