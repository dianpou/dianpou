<?php namespace App\Models;


class Logistics extends Model {
    public $casts = array(
        'deliverer_settings' => 'json',
        'deliverer_cod' => 'json',
    );

    protected $_deliverer = null;

    public function getValidations() {
        return array(
            'deliverer_name' => 'required|max:50',
        );
    }

    public function getDelivererAttribute($value='')
    {
        if ($this->_deliverer === null) {
            $this->_deliverer = new $this->deliverer_name($this->deliverer_settings);
        }

        return $this->_deliverer;
    }
}
