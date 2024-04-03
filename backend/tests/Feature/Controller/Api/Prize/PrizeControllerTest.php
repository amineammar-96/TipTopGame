<?php

namespace App\Tests\Feature\Controller\Api\Prize;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class PrizeControllerTest extends WebTestCase
{
    private $client;

    private $entityManager;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()->get('doctrine')->getManager();
    }

    public function testGetAllPrizes(): void
    {
        $this->client->request('GET', '/api/prizes');

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        // Decode the response content to an associative array
        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        // Assert that the 'status' key exists in the response
        $this->assertArrayHasKey('status', $responseData);

        // Assert that the 'status' key value is 'success'
        $this->assertEquals('success', $responseData['status']);

        // Assert that the 'prizes' key exists in the response
        $this->assertArrayHasKey('prizes', $responseData);

        // Assert that the 'prizes' key value is an array
        $this->assertIsArray($responseData['prizes']);

        // Iterate through each prize in the response
        foreach ($responseData['prizes'] as $prize) {
            // Assert that each prize has the required keys
            $this->assertArrayHasKey('id', $prize);
            $this->assertArrayHasKey('label', $prize);
            $this->assertArrayHasKey('name', $prize);
            $this->assertArrayHasKey('type', $prize);
            $this->assertArrayHasKey('prize_value', $prize);
            $this->assertArrayHasKey('winning_rate', $prize);
            $this->assertArrayHasKey('totalCount', $prize);
            $this->assertArrayHasKey('percentage', $prize);

            $this->assertGreaterThanOrEqual(0, $prize['percentage']);
            $this->assertLessThanOrEqual(100, $prize['percentage']);
        }
    }
}
