<?php namespace App\Libraries\Interfaces;

use App\Libraries\Payment\Order;
use Illuminate\Http\Request;

interface Payment {
    public function purchase(Order $order);
    public function complete(Order $order);
    public function settings(array $settings);
    public function isSuccessful($response);
}
