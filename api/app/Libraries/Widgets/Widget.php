<?php namespace App\Libraries\Widgets;

use File, Image;
use App\Libraries\Form;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\File\MimeType\FileinfoMimeTypeGuesser;

class Widget
{
    public $settings;
    public $data;
    public $component;
    public $placeholder = '';
    public function __construct($settings = [], $data = [])
    {
        $this->settings = new Form($this->getSettingsForm());
        if ($settings) {
            $this->settings->set($settings);
        }
        $this->data = $data;
        $this->init();
    }

    public function getSettingsForm()
    {
        return [
            'data' => [ 'type' => Form::TEXTAREA, 'example'=>$this->example, 'label' => '数据' ],
        ];
    }

    public function init()
    {
    }

    public function settings(array $settings = null)
    {
        if (is_array($settings)) {
            return $this->settings->set($settings);
        }

        return $this->settings->get();
    }
}
