<?php namespace App\Models;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Storage, File;

class ProductPhoto extends Model {
    public $timestamps = false;
    // protected $dependents = ['file'];
    public function getValidations() {
        return array(
            'product_id'    => 'required|integer',
        );
    }
    public function save(array $options = array())
    {
        if ($this->file && !$this->id) {
            if (!($this->file instanceof UploadFile)) {
              $file = new UploadFile(["file_name"=>$this->file['file_name'], "file" => $this->file['file_path']]);
              $file->save();
              $this->file_id = $file->id;
              unset($this->file);
            }
        }
        parent::save($options);
    }
    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }
    public function file()
    {
        return $this->belongsTo('App\Models\UploadFile');
    }
    public function getPhotoIdAttribute()
    {
        return $this->id;
    }
    protected static function boot()
    {
        parent::boot();
        static::deleting(function ($photo)
        {
            UploadFile::destroy($photo->file_id);
        });
    }
}
