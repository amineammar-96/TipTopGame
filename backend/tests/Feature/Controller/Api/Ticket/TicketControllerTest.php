<?php

namespace App\Tests\Feature\Controller\Api\Ticket;

use App\Entity\Role;
use App\Entity\Ticket;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Response;

class TicketControllerTest extends WebTestCase
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

    public function testGetTicketByCode(): void
    {
        $randomTicket = $this->entityManager->getRepository(Ticket::class)->findOneBy([]);
        if(!$randomTicket) {
            $this->fail('No ticket found in database');
        }
        $this->client->request('GET', '/api/ticket/'.$randomTicket->getTicketCode());

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }
    public function testGetTickets()
    {
        $url ='/api/tickets';

        $admin = new User();
        $admin->setEmail('admin@tiptop.com');
        $admin->setPassword($this->passwordEncoder->hashPassword($admin, 'password'));
        $admin->setIsActive(true);
        $admin->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_EMPLOYEE']));
        $admin->setCreatedAt(new \DateTime());
        $admin->setUpdatedAt(new \DateTime());
        $admin->setDateOfBirth(new \DateTime());
        $admin->setFirstName('Test');
        $admin->setLastName('User');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);


        $this->entityManager->persist($admin);

        $this->entityManager->flush();

        $this->client->loginUser($admin);

        $params = [
            'ticket_code' => '123456',
            'status' => 'pending',
            'store' => '1',
            'caissier' => '1',
            'client' => '1',
            'prize' => '1',
            'page' => '1',
            'limit' => '9'
        ];

        $url .= '?'.http_build_query($params);

        $this->client->request('GET', $url);

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $content = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('tickets', $content);
        $this->assertArrayHasKey('totalCount', $content);
    }

    public function testGetTickets2()
    {
        $url ='/api/tickets';

        $admin = new User();
        $admin->setEmail('admin@tiptop.com');
        $admin->setPassword($this->passwordEncoder->hashPassword($admin, 'password'));
        $admin->setIsActive(true);
        $admin->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_STOREMANAGER']));
        $admin->setCreatedAt(new \DateTime());
        $admin->setUpdatedAt(new \DateTime());
        $admin->setDateOfBirth(new \DateTime());
        $admin->setFirstName('Test');
        $admin->setLastName('User');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);


        $this->entityManager->persist($admin);

        $this->entityManager->flush();

        $this->client->loginUser($admin);

        $params = [
            'ticket_code' => '123456',
            'status' => 'pending',
            'store' => '1',
            'caissier' => 1,
            'client' => 1,
            'prize' => 1,
            'page' => 1,
            'limit' => '9'
        ];

        $url .= '?'.http_build_query($params);

        $this->client->request('GET', $url);

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $content = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('tickets', $content);
        $this->assertArrayHasKey('totalCount', $content);
    }

    public function testGetTickets3()
    {
        $url ='/api/tickets';

        $admin = new User();
        $admin->setEmail('admin@tiptop.com');
        $admin->setPassword($this->passwordEncoder->hashPassword($admin, 'password'));
        $admin->setIsActive(true);
        $admin->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_CLIENT']));
        $admin->setCreatedAt(new \DateTime());
        $admin->setUpdatedAt(new \DateTime());
        $admin->setDateOfBirth(new \DateTime());
        $admin->setFirstName('Test');
        $admin->setLastName('User');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);


        $this->entityManager->persist($admin);

        $this->entityManager->flush();

        $this->client->loginUser($admin);

        $params = [
            'ticket_code' => '123456',
            'status' => 'pending',
            'store' => '1',
            'caissier' => 1,
            'client' => 1,
            'prize' => 1,
            'page' => 1,
            'limit' => '9'
        ];

        $url .= '?'.http_build_query($params);

        $this->client->request('GET', $url);

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $content = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('tickets', $content);
        $this->assertArrayHasKey('totalCount', $content);
    }

    //checkTicketForPlay test
    public function testCheckTicketForPlay()
    {
        $url = '/api/tickets/check/play';

        $admin = new User();
        $admin->setEmail('email' . rand() . '@tiptop.com');
        $admin->setPassword($this->passwordEncoder->hashPassword($admin, 'password'));
        $admin->setIsActive(true);
        $admin->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_CLIENT']));
        $admin->setCreatedAt(new \DateTime());
        $admin->setUpdatedAt(new \DateTime());
        $admin->setDateOfBirth(new \DateTime());
        $admin->setFirstName('Test');
        $admin->setLastName('User');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);

        $this->entityManager->persist($admin);
        $this->entityManager->flush();


    }

}