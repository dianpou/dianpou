<?php namespace App\Models;

use File;

class Plugin extends Model
{
    public $casts = [
        'plugin_settings' => 'jsonb',
        'plugin_components' => 'jsonb',
    ];

    public static function available($component = null)
    {
        static $availables = null;
        if ($availables === null) {
            $plugin_path = app_path() . '/Plugins';

            $available_names = File::directories($plugin_path);

            foreach ($available_names as $dir) {
                $name = basename($dir);
                $describe_file = $plugin_path . '/' . $name . '/plugin.describe.php';
                if (File::exists($describe_file)) {
                    $describe = include($describe_file);
                    if (!empty($describe['components']['deliverers'])) {
                        foreach ($describe['components']['deliverers'] as $classpath => $cdescribe) {
                            $describe['components']['deliverers'][$classpath]['settings_form'] = with(new $classpath)->settings->form();
                        }
                    }
                    if (!empty($describe['components']['payments'])) {
                        foreach ($describe['components']['payments'] as $classpath => $cdescribe) {
                            $describe['components']['payments'][$classpath]['settings_form'] = with(new $classpath)->settings->form();
                        }
                    }
                    if (!empty($describe['components']['Pages'])) {
                        foreach ($describe['components']['Pages'] as $classpath => $cdescribe) {
                            $describe['components']['Pages'][$classpath]['settings_form'] = with(new $classpath)->settings->form();
                        }
                    }
                    $availables[$name] = $describe;
                }
            }
        }
        if (in_array($component, ['deliverers', 'payments', 'Pages'])) {
            $result = [];
            foreach ($availables as $name => $plugin) {
                foreach ($plugin['components'][$component] as $classpath => $cdescribe) {
                    $result[$classpath] = $cdescribe;
                }
            }
        } else {
            $result = $availables;
        }

        return $result;
    }
}
