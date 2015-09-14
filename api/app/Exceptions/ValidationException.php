<?php namespace App\Exceptions;

/**
*
*/
class ValidationException extends \RuntimeException
{
    public $messages = array();
    public function __construct($messages, $prev = null, $code = 0)
    {
        $this->messages = $messages;
        $message = '';
        foreach ($messages->getMessages() as $k => $m) {
            $message .= implode($m, ';');
        }
        return parent::__construct($message, $code, $prev);
    }
}