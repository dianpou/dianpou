<?php namespace App\Models;

class Page extends Model {
    public $casts = [
        'settings' => 'json',
        // 'data' => 'json',
    ];
    // public function toArray()
    // {
    //     return array_merge(parent::toArray(), [
    //         'component'=>$this->plugin->component
    //     ]);
    // }
    // public function getPluginAttribute()
    // {
    //     static $plugin = null;
    //     if ($plugin === null) {
    //         $plugin = new $this->class_name($this->settings, $this->data);
    //     }
    //
    //     return $plugin;
    // }
}
