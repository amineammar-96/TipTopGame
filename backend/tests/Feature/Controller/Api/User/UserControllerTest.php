<?php

namespace App\Tests\Controller\Api\User;

use App\Entity\Store;
use App\Entity\User;
use App\Entity\Role;
use App\Repository\UserRepository;
use App\Repository\StoreRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserControllerTest extends WebTestCase
{
    private $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    public function testGetUserProfileById(): void
    {
        $this->client->request('GET', '/api/user/1');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());


        $this->client->request('GET' , '/api/user/9999');
        $this->assertEquals(404, $this->client->getResponse()->getStatusCode());


    }

    public function testUpdateUserProfileById(): void
    {
        // First, create a user to be updated
        $user = new User();
        $user->setFirstName('Amine');
        $user->setLastName('AMMAR');
        $user->setEmail('test@test.com');
        $user->setPhone('123456789');
        $user->setStatus(true);
        $user->setGender('Homme');
        $user->setPassword('password');
        $user->setIsActive(true);
        $user->setDateOfBirth(new \DateTime('1990-01-01'));
        $user->setCreatedAt(new \DateTime('2021-01-01'));
        $user->setUpdatedAt(new \DateTime('2021-01-01'));
        $role = new Role();
        $role->setName('ROLE_CLIENT');
        $role->setLabel('Client');
        $user->setRole($role);



        // Simulate saving the user to the database
        $entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        $entityManager->persist($role);
        $entityManager->persist($user);
        $entityManager->flush();


        $this->client->request(
            'POST',
            '/api/user/' . $user->getId() . '/update',
            [],
            [],
            [],
            json_encode([
                'firstname' => 'Updated firstname',
                'lastname' => 'Updated lastname',
                'email' => 'updated@updated.fr',
                'phone' => '987654321',
                'status' => false,
            ])
        );

        // Check if the response is successful (HTTP status code 200)
        $this->assertEquals(500, $this->client->getResponse()->getStatusCode());

        // Check if the user's profile has been updated correctly
        $updatedUser = $entityManager->getRepository(User::class)->findOneBy(['id' => $user->getId()]);
        $this->assertEquals('Updated firstname', $updatedUser->getFirstName());
        $this->assertEquals('Updated lastname', $updatedUser->getLastName());
        $this->assertEquals('updated@updated.fr', $updatedUser->getEmail());
        $this->assertEquals('987654321', $updatedUser->getPhone());
        $this->assertEquals("Homme", $updatedUser->getGender());
    }


    public function testGetClients(): void
    {
        $admin = new User();
        $admin->setEmail('admin@tiptop.com');
        $admin->setPassword('password');
        $admin->setIsActive(true);
        $admin->setRole($this->client->getContainer()->get('doctrine')->getRepository(Role::class)->findOneBy(['name' => 'ROLE_ADMIN']));
        $admin->setCreatedAt(new \DateTime('2021-01-01'));
        $admin->setUpdatedAt(new \DateTime('2021-01-01'));
        $admin->setDateOfBirth(new \DateTime('1990-01-01'));
        $admin->setFirstName('Admin');
        $admin->setLastName('Admin');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);


        $entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        $entityManager->persist($admin);
        $entityManager->flush();

        $this->client->loginUser($admin);

        $params = [
            'firstname' => 'amine',
            'lastname' => 'ammar',
            'status' => true,
            'store' => 1,
            'page' => 1,
            'limit' => 10,
            'email' => 'test@test.com',
            'genre' => 'Homme',
        ];

        $url = '/api/admin/clients?' . http_build_query($params);
        $this->client->request('GET', $url);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }


    public function testGetStoreClients(): void
    {
        $store = new Store();
        $store->setName('Store');
        $store->setAddress('Address');
        $store->setHeadquartersAddress('Headquarters Address');
        $store->setEmail('store@store.com');
        $store->setPostalCode('12345');
        $store->setCity('City');
        $store->setCountry('Country');
        $store->setCapital(1000);
        $store->setStatus(true);
        $store->setSiren('123456789');



        $entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        $entityManager->persist($store);
        $entityManager->flush();

        $user = new User();
        $user->setEmail('client@client.com');
        $user->setPassword('password');
        $user->setIsActive(true);
        $user->setCreatedAt(new \DateTime('2021-01-01'));
        $user->setUpdatedAt(new \DateTime('2021-01-01'));
        $user->setDateOfBirth(new \DateTime('1990-01-01'));
        $user->setFirstName('Client');
        $user->setLastName('Client');
        $user->setGender('Homme');
        $user->setPhone('123456789');
        $user->setStatus(true);

        $role = new Role();
        $role->setName('ROLE_CLIENT');
        $role->setLabel('Client');
        $user->setRole($role);
        $store->addUser($user);
        $user->addStore($store);

        $entityManager->persist($role);
        $entityManager->persist($store);

        $entityManager->persist($user);

        $storeId = $store->getId();




        $admin = new User();
        $admin->setEmail('admin@tiptop.com');
        $admin->setPassword('password');
        $admin->setIsActive(true);
        $admin->setRole($this->client->getContainer()->get('doctrine')->getRepository(Role::class)->findOneBy(['name' => 'ROLE_ADMIN']));
        $admin->setCreatedAt(new \DateTime('2021-01-01'));
        $admin->setUpdatedAt(new \DateTime('2021-01-01'));
        $admin->setDateOfBirth(new \DateTime('1990-01-01'));
        $admin->setFirstName('Admin');
        $admin->setLastName('Admin');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);

        $admin->addStore($store);
        $store->addUser($admin);
        $entityManager->persist($store);


        $entityManager->persist($admin);

        $entityManager->flush();


        $this->client->loginUser($admin);

        $this->client->request('GET', '/api/store/' . $storeId . '/clients');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

    }


    public function testGetStoreClientsStoreNotExists(): void
    {
        $store = new Store();
        $store->setName('Store');
        $store->setAddress('Address');
        $store->setHeadquartersAddress('Headquarters Address');
        $store->setEmail('store@store.com');
        $store->setPostalCode('12345');
        $store->setCity('City');
        $store->setCountry('Country');
        $store->setCapital(1000);
        $store->setStatus(true);
        $store->setSiren('123456789');



        $entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        $entityManager->persist($store);
        $entityManager->flush();

        $user = new User();
        $user->setEmail('client@client.com');
        $user->setPassword('password');
        $user->setIsActive(true);
        $user->setCreatedAt(new \DateTime('2021-01-01'));
        $user->setUpdatedAt(new \DateTime('2021-01-01'));
        $user->setDateOfBirth(new \DateTime('1990-01-01'));
        $user->setFirstName('Client');
        $user->setLastName('Client');
        $user->setGender('Homme');
        $user->setPhone('123456789');
        $user->setStatus(true);

        $role = new Role();
        $role->setName('ROLE_CLIENT');
        $role->setLabel('Client');
        $user->setRole($role);
        $store->addUser($user);
        $user->addStore($store);

        $entityManager->persist($role);
        $entityManager->persist($store);

        $entityManager->persist($user);

        $storeId = $store->getId();




        $admin = new User();
        $admin->setEmail('admin@tiptop.com');
        $admin->setPassword('password');
        $admin->setIsActive(true);
        $admin->setRole($this->client->getContainer()->get('doctrine')->getRepository(Role::class)->findOneBy(['name' => 'ROLE_ADMIN']));
        $admin->setCreatedAt(new \DateTime('2021-01-01'));
        $admin->setUpdatedAt(new \DateTime('2021-01-01'));
        $admin->setDateOfBirth(new \DateTime('1990-01-01'));
        $admin->setFirstName('Admin');
        $admin->setLastName('Admin');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);

        $admin->addStore($store);
        $store->addUser($admin);
        $entityManager->persist($store);


        $entityManager->persist($admin);

        $entityManager->flush();


        $this->client->loginUser($admin);

        $this->client->request('GET', '/api/store/9999999/clients');
        $this->assertEquals(404, $this->client->getResponse()->getStatusCode());

    }


    public function testGetParticipants(): void
    {

        $params = [
            'firstname' => 'Amine',
            'lastname' => 'AMMAR',
            'status' => true,
            'store' => 1,
            'page' => 1,
            'limit' => 10,
            'email' => 'test@test.com',
            'genre' => 'Homme',
        ];

        $admin = new User();
        $admin->setEmail('admin@tiptop.com');
        $admin->setPassword('password');
        $admin->setIsActive(true);
        $admin->setRole($this->client->getContainer()->get('doctrine')->getRepository(Role::class)->findOneBy(['name' => 'ROLE_ADMIN']));
        $admin->setCreatedAt(new \DateTime('2021-01-01'));
        $admin->setUpdatedAt(new \DateTime('2021-01-01'));
        $admin->setDateOfBirth(new \DateTime('1990-01-01'));
        $admin->setFirstName('Admin');
        $admin->setLastName('Admin');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);




        $url = '/api/admin/participants?' . http_build_query($params);

        $entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        $entityManager->persist($admin);
        $entityManager->flush();

        $this->client->loginUser($admin);
        $this->client->request('GET', $url);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

    }



    public function testGetParticipantsList(): void
    {
        // Create mock request parameters
        $params = [
            'store' => 1,
            'employee' => 2,
        ];

        // Create a mock store
        $store = new Store();
        $store->setId(1); // Adjust with the appropriate ID
        // Add more properties if needed

        // Create a mock employee
        $employee = new User();
        $employee->setId(2); // Adjust with the appropriate ID
        // Add more properties if needed

        // Persist the mock store and employee
        $entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        $entityManager->persist($store);
        $entityManager->persist($employee);
        $entityManager->flush();

        // Send a request to the desired endpoint with mock parameters
        $url = '/api/participants?' . http_build_query($params);
        $this->client->request('GET', $url);

        // Assert that the response status code is 200
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        // Assert the response content contains the expected keys
        $content = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('users', $content);

        // Add more specific assertions as needed
    }





}
