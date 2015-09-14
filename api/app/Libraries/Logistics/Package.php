<?php namespace App\Libraries\Logistics;

/**
*
*/
class Package
{
    private $items;
    private $quantity = 0;
    private $weight = 0;
    private $volume = 0;
    private $destination = null;

    public function add($quantity = 1, $weight = 0, $volume = [0, 0, 0], $label = 'item')
    {
        if (is_array($quantity)) {
            $item = array_only($quantity, ['label', 'quantity', 'weight', 'volume']);
        } else {
            $item = [
                "label" => $label,
                "quantity" => $quantity,
                "weight" => $weight,
                "volume" => $volume
            ];
        }

        $this->items[] = $item;

        $this->quantity += array_get($item, 'quantity', 0);
        $this->weight += array_get($item, 'weight', 0);
        $volume = array_get($item, 'volume', [0, 0, 0]);
        $this->volume += intval($volume[0] * $volume[1] * $volume[2]);
    }

    public function to($destination)
    {
        $this->destination = $destination;
    }

    public function getQuantity()
    {
        return $this->quantity;
    }

    public function getWeight()
    {
        return $this->weight;
    }

    public function getVolume()
    {
        return $this->volume;
    }

    public function getDestination()
    {
        return $this->destination;
    }
}