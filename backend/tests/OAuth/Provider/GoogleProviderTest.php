<?php

namespace App\Tests\OAuth\Provider;

use App\OAuth\Provider\GoogleProvider;
use League\OAuth2\Client\Provider\Google;
use PHPUnit\Framework\TestCase;

class GoogleProviderTest extends TestCase
{
    public function testGetAuthorizationUrl()
    {


        $options = [
            'clientId' => '192955803685-ht0po3lmr0m02p1as6hvo7dedih9kqhf.apps.googleusercontent.com',
            'clientSecret' => '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',
            'redirectUri' => 'http://localhost:3000/client_login/google_callback',
        ];

        $provider = new GoogleProvider();

        $google = $provider($options);

        $this->assertInstanceOf(Google::class, $google);

    }
}
