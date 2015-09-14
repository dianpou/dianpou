<?php namespace Tests\Unit;

use TestCase;
use App\Libraries\Form;

class FormTest extends TestCase
{
    public function testNew()
    {
        $form = new Form([
            'string' => [
                'type' => Form::TEXT
            ],
            'array'  => [
                'type' => Form::SELECT,
                'options' => [
                    0, 1
                ]
            ],
        ]);
        $this->assertEquals([
            'string' => [
                'type' => Form::TEXT
            ],
            'array'  => [
                'type' => Form::SELECT,
                'options' => [
                    0, 1
                ]
            ],
        ], $form->form());

        return $form;
    }

    /** @depends testNew */
    public function testSetForm($form)
    {
        $form->form([
            'price'     => Form::TEXT,
            'effective' => [
                'type' => Form::SELECT,
                'options' => [
                    '一个工作日',
                    '一到三个工作日',
                ]
            ],
        ]);

        $this->assertEquals([
            'price'     => [
                'type' => Form::TEXT,
                'label'=> 'price',
            ],
            'effective' => [
                'type' => Form::SELECT,
                'options' => [
                    '一个工作日',
                    '一到三个工作日',
                ]
            ],
        ], $form->form());

        return $form;
    }

    /** @depends testSetForm */
    public function testSetAndGetValue($form)
    {
        $form->set('effective', '一到三个工作日');
        $this->assertEquals('一到三个工作日', $form->get('effective'));
        $form->set([
            'effective' => '一个工作日',
            'price'     => 100,
        ]);
        $this->assertEquals([
            'effective' => '一个工作日',
            'price'     => 100,
        ], $form->get());
        $form->set('effective', '不存在的值');
        $this->assertEquals('一个工作日', $form->get('effective'));
    }
}
