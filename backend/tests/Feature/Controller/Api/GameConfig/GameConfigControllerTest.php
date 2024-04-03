<?php

namespace App\Tests\Feature\Controller\Api\GameConfig;

use App\Entity\GameConfig;
use App\Entity\Role;
use App\Entity\User;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class GameConfigControllerTest extends WebTestCase
{
    private $client;

    private $entityManager;

    private $passwordEncoder;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        $this->passwordEncoder = $this->client->getContainer()->get(UserPasswordHasherInterface::class);

    }

    public function testGetGameConfig(): void
    {
        $user = new User();
        $user->setEmail('admin@tiptop.com');
        $user->setPassword($this->passwordEncoder->hashPassword($user, 'password'));
        $user->setIsActive(true);
        $user->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_ADMIN']));
        $user->setCreatedAt(new \DateTime());
        $user->setUpdatedAt(new \DateTime());
        $user->setDateOfBirth(new \DateTime());
        $user->setFirstName('Test');
        $user->setLastName('User');
        $user->setGender('Homme');
        $user->setPhone('123456789');
        $user->setStatus(true);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->client->loginUser($user);

        // Make a request to fetch game configuration
        $this->client->request('GET', '/api/game_config');

        // Assert that the response is successful
        $this->assertResponseIsSuccessful();

        // Assert that the response contains JSON content type
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        // Decode the response content to an associative array
        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        // Assert that the required keys exist in the response
        $this->assertArrayHasKey('gameConfig', $responseData);
        $this->assertArrayHasKey('principalPeriodFinishAt', $responseData);
        $this->assertArrayHasKey('validationPeriodFinishAt', $responseData);
        $this->assertArrayHasKey('timeRemainingToStart', $responseData);
        $this->assertArrayHasKey('gameStatus', $responseData);
        $this->assertArrayHasKey('time', $responseData);
        $this->assertArrayHasKey('participantsCount', $responseData);
    }

    public function testUpdateGameConfig(): void
    {
        $gameConfigData = [
            'startDate' => '01/01/2022',
            'time' => '12:00'
        ];

        $user = new User();
        $user->setEmail('admin@tiptop.com');
        $user->setPassword($this->passwordEncoder->hashPassword($user, 'password'));
        $user->setIsActive(true);
        $user->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_ADMIN']));
        $user->setCreatedAt(new \DateTime());
        $user->setUpdatedAt(new \DateTime());
        $user->setDateOfBirth(new \DateTime());
        $user->setFirstName('Test');
        $user->setLastName('User');
        $user->setGender('Homme');
        $user->setPhone('123456789');
        $user->setStatus(true);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->client->loginUser($user);

        $this->client->request(
            'POST',
            '/api/game_config/update',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($gameConfigData)
        );

        $this->assertResponseIsSuccessful();

        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('gameConfig', $responseData);

        $gameConfig = $this->entityManager->getRepository(GameConfig::class)->findAll();
        $gameConfig = $gameConfig[0] ?? null;

        $this->assertNotNull($gameConfig);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

    }


    public function testUpdateGameConfigWithDeletingGameConfig(): void
    {
        $gameConfigData = [
            'startDate' => '01/01/2022',
            'time' => '12:00'
        ];

        $user = new User();
        $user->setEmail('admin@tiptop.com');
        $user->setPassword($this->passwordEncoder->hashPassword($user, 'password'));
        $user->setIsActive(true);
        $user->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_ADMIN']));
        $user->setCreatedAt(new \DateTime());
        $user->setUpdatedAt(new \DateTime());
        $user->setDateOfBirth(new \DateTime());
        $user->setFirstName('Test');
        $user->setLastName('User');
        $user->setGender('Homme');
        $user->setPhone('123456789');
        $user->setStatus(true);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->client->loginUser($user);

        $gameConfigs = $this->entityManager->getRepository(GameConfig::class)->findAll();

        foreach ($gameConfigs as $gameConfig) {
            $this->entityManager->remove($gameConfig);
        }
        $this->entityManager->flush();


        $this->client->request(
            'POST',
            '/api/game_config/update',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($gameConfigData)
        );

        $this->assertResponseIsSuccessful();

        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('gameConfig', $responseData);

        $gameConfig = $this->entityManager->getRepository(GameConfig::class)->findAll();
        $gameConfig = $gameConfig[0] ?? null;

        $this->assertNotNull($gameConfig);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());



    }


}
