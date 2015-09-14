<?php namespace App\Libraries\Misc;

use App\Libraries\Interfaces\Operator;

/**
*
*/
class SystemOperator implements Operator
{

    public function getOperatorType()
    {
        return 'System';
    }

    public function getOperatorId()
    {
        return 0;
    }
}