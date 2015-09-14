<?php namespace App\Models;


class RejectLog extends Model {
    public $timestamps = false;
    public function getValidations() {
        return array(
            'reject_id' => 'required',
            'operator_type' => 'required',
            'operator_id' => 'required',
            'operate_content' => 'required',
            );
    }

    public function operator()
    {
        return $this->morphTo();
    }
    public function Reject()
    {
        return $this->belongsTo('App\Models\Reject');
    }
}
