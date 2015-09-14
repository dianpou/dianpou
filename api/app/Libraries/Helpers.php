<?php

function files($file_path)
{
    return env('DP_FILES_ENDPOINT') . $file_path;
}

function make_tree($nodes, $parent_id = 0)
{
    $tree = array();
    foreach ($nodes as $node) {
        if ($node['parent_id'] == $parent_id) {
            $node['children'] = make_tree($nodes, $node['id']);
            $tree[] = $node;
        }
    }

    return $tree;
}
