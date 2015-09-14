<?php namespace App\Libraries\Interfaces;

use App\Libraries\Logistics\Package;

interface Deliverer {
    public function calc(Package $package);
    public function ship(Package $package);
    public function settings(array $settings);
}