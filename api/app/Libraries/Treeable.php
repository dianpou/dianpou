<?php namespace App\Libraries;

trait Treeable {
    public function parents()
    {
        $parents_id = array_filter(explode('/', $this->parents));
        if (!empty($parents_id)) {
            return static::whereIn('id', $parents_id)->get();
        }
    }

    public function save(array $options = array())
    {
        $changed = $this->getDirty();
        if ($changed['parent_id'] && $this->parent_id) {
            $parent = static::find($this->parent_id);
            $this->parents = $parent->parents . $this->parent_id . '/';
        }

        return parent::save($options);
    }

    public function children()
    {
        $class_name = get_class($this);
        return $this->hasMany($class_name, 'parent_id');
    }

    public function parent()
    {
        $class_name = get_class($this);
        return $this->belongsTo($class_name, 'id', 'parent_id');
    }

    public static function tree($root_id = 0)
    {
        if ($root_id) {
            $root = static::findOrFail($root_id);
            $categories = static::whereRaw('parents LIKE ?', array($root->parents . $root_id . '/%'))->get();
        } else {
            $categories = static::all();
        }

        $tree = make_tree($categories, $root_id);

        return $tree;
    }
}