<?php

namespace App\Tests\Feature\Controller\Api\ConnectionHistory;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class ConnectionHistoryControllerTest extends WebTestCase
{
    private $client;

    private $entityManager;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()->get('doctrine')->getManager();
    }

    public function testGetConnectionsHistory(): void
    {
        $this->client->request('GET', '/api/connection_history' , $params = [
            'user' => 1,
            'store' => 'store',
            'role' => 'role',
            'page' => 1,
            'limit' => 10,
            'start_date' => '01/01/2021',
            'end_date' => '01/01/2022',
        ]);

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('connectionsHistory', $responseData);

        $this->assertIsArray($responseData['connectionsHistory']);

        $this->assertArrayHasKey('connectionsHistoryCount', $responseData);
    }


    public function testGetConnectionsHistory2(): void
    {
        $this->client->request('GET', '/api/connection_history' , $params = [
            'start_date' => '01/01/2021',
        ]);

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('connectionsHistory', $responseData);

        $this->assertIsArray($responseData['connectionsHistory']);

        $this->assertArrayHasKey('connectionsHistoryCount', $responseData);
    }

    public function testGetConnectionsHistory3(): void
    {
        $this->client->request('GET', '/api/connection_history' , $params = [
            'end_date' => '01/01/2022',
        ]);

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('connectionsHistory', $responseData);

        $this->assertIsArray($responseData['connectionsHistory']);

        $this->assertArrayHasKey('connectionsHistoryCount', $responseData);
    }

}
