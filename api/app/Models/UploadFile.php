<?php namespace App\Models;

use Storage, File;

class UploadFile extends Model {
    public $timestamps = false;

    public function save(array $options = array())
    {
        if ($this->file instanceof UploadedFile || strlen($this->file) > 255) {
            if ($this->file instanceof UploadedFile) {
                $this->file_name = $this->file->getClientOriginalName();
                $this->file_type = $this->file->getClientMimeType();
                $this->file_size = $this->file->getClientSize();
                $data = File::get($this->file);
            } else {
                list($type, $data) = explode(';', $this->file);
                list(,$this->file_type) = explode(':', $type);
                list(, $data)      = explode(',', $data);
                $data = base64_decode($data);
                $this->file_size = strlen($data);
            }

            $path = date('Y/m/d/') . md5(uniqid() . '-' . $this->file_name) . '.' . File::extension($this->file_name);
            Storage::put($path, $data);
            $this->file_path = $path;
            unset($this->file);
        }
        return parent::save($options);
    }

    public function getContents()
    {
        return Storage::get($this->getAttributeFromArray('file_path'));
    }

    public function getFilePathAttribute($value)
    {
        return route('api.file', ['file' => $value]);
    }

    protected static function boot()
    {
        parent::boot();
        static::deleting(function ($file)
        {
            Storage::delete($file->getAttributeFromArray('file_path'));
        });
    }
}
