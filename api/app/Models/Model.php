<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model as BaseModel;
use Validator;
use App\Exceptions\ValidationException;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Model extends BaseModel
{
    public $validator = null;
    protected $guarded = ['id'];
    protected $dependents = [];
    protected $validations = array();
    public function getValidations() {
        return $this->validations;
    }
    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);

        $this->validator = Validator::make($this->getAttributes(), $this->getValidations());
    }


    public function save(array $options = array())
    {
        if (!array_get($options, 'force', false)) {
            $this->validator->setData($this->getAttributes());
            $this->validator->setRules($this->getValidations());
            if ($this->validator->fails()) {
                throw new ValidationException($this->validator->messages());
            }
        }
        return parent::save($options);
    }

    public function deleteDependents()
    {
        foreach ($this->dependents as $relation_name) {
            $relation = $this->$relation_name();
            if ($relation instanceof BelongsToMany) {
                $relation->detach();
            } else {
                $relation->delete();
            }
        }
    }

    protected function uniqueExcept()
    {
        return $this->id ? ',' . $this->id : '';
    }

    protected static function boot()
    {
        parent::boot();
        static::deleting(function ($instance) {
            $instance->deleteDependents();
        });
    }
}
