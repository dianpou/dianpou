<?php
/**
 * OAuth 2.0 Guest grant
 *
 * @package     league/oauth2-server
 * @author      Alex Bilbie <hello@alexbilbie.com>
 * @copyright   Copyright (c) Alex Bilbie
 * @license     http://mit-license.org/
 * @link        https://github.com/thephpleague/oauth2-server
 */

namespace App\Libraries\OAuth;

use League\OAuth2\Server\Grant\PasswordGrant;

/**
 * Password grant class
 */
class OpenidGrant extends PasswordGrant
{
    /**
     * Grant identifier
     *
     * @var string
     */
    protected $identifier = 'openid';
}
