<?php namespace App\Libraries;


class Form
{
    const TEXT   = 'text';
    const TEXTAREA   = 'textarea';
    const SELECT = 'select';
    private $form   = [];
    private $value  = [];
    public function __construct($form)
    {
        $this->form($form);
    }

    public function set($k, $v = null)
    {
        if (is_array($k) && $v === null) {
            $value = $k;
        } else {
           $value = [$k => $v];
        }

        foreach ($value as $k => $v) {
            if ($this->form[$k]) {
                if ($options = array_get($this->form[$k], 'options')) {
                    if (in_array($v, $options)) {
                        $this->value[$k] = $v;
                    }
                } else {
                    $this->value[$k] = $v;
                }
            }
        }

        return $this->value;

    }

    public function get($key = null)
    {
        if ($key === null) {
            return $this->value;
        }

        return array_get($this->value, $key);
    }
    public function form($form = null)
    {
        if ($form !== null) {
            $this->form = [];
            foreach ($form as $k => $f) {
                if (is_array($f)) {
                    $f = array_only($f, ['type',
                                         'label',
                                         'options',
                                         'multiple',
                                         'default',
                                         'placeholder',
                                         'example']);
                } elseif($f == self::TEXT) {
                    $f = [
                        'type' => $f,
                        'label'=> $k,
                    ];
                }
                $this->form[$k] = $f;
            }
        }

        return $this->form;
    }
}
