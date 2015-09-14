<?php namespace Tests\API;

use TestCase;
class AddressTest extends TestCase {
    public function setUp()
    {
        parent::setUp();
        $this->resetEvents('App\Models\Address');
        $this->headers = [
            'Authorization' => 'SyjKhdQ1JcKs1S6X18VQW2LaTclJYzW4AC1dfkFk',
        ];
    }

    public function testStore()
    {
        $this->post(route('api.address.index'), json_encode([
            'consignee' => 'Garbin Huang',
            'region' => ['福建', '福州', '仓山区'],
            'address' => '福湾新城春风苑2区6号楼802',
            'zipcode' => '3500001',
            'mobile' => '18610073651',
            'phone' => '',
            'email' => 'garbinh@gmail.com',
        ]));
        $this->assertNotEmpty($this->response->original->id, $this->response->getContent());
        $this->assertResponseStatus(201);
        return $this->response->original;
    }

    /**
    *
    * @depends testStore
    */
    public function testShow($address)
    {
        $this->get(route('api.address.item', $address));
        $this->assertResponseOk();
    }

    /**
    *
    * @depends testStore
    */
    public function testUpdate($addr)
    {
        $this->put(route('api.address.item', $addr), json_encode([
            'phone' => '18610073651'
            ]));
        $this->assertSame('18610073651', $this->response->original->phone, $this->response->getContent());
        $this->assertResponseOk();
    }


    /**
    *
    * @depends testStore
    */
    public function testIndex()
    {
        $this->get(route('api.address.index'));
        $this->assertResponseOk();
    }


    /**
    *
    * @depends testStore
    */
    public function testDestroy($addr)
    {
        $reponse = $this->delete(route('api.address.item', $addr));
        $this->assertResponseStatus(204);
    }
}
