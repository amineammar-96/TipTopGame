<?php

namespace App\Tests\Feature\Controller\Api\Dashboard;

use App\Entity\LoyaltyPoints;
use App\Entity\Role;
use App\Entity\Ticket;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class DashboardControllerTest extends WebTestCase
{
    private $client;

    private $entityManager;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        $this->passwordEncoder = $this->client->getContainer()->get(UserPasswordHasherInterface::class);

    }

    public function testGetClientDashboardCounters(): void
    {

        $user = new User();
        $user->setEmail('client@tiptop.com');
        $user->setPassword($this->passwordEncoder->hashPassword($user, 'password'));
        $user->setIsActive(true);
        $user->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_CLIENT']));
        $user->setCreatedAt(new \DateTime());
        $user->setUpdatedAt(new \DateTime());
        $user->setDateOfBirth(new \DateTime());
        $user->setFirstName('Test');
        $user->setLastName('User');
        $user->setGender('Homme');
        $user->setPhone('123456789');
        $user->setStatus(true);
        $this->entityManager->persist($user);

        $loyaltyPoint = new LoyaltyPoints();
        $loyaltyPoint->setPoints(100);
        $loyaltyPoint->setUser($user);
        $loyaltyPoint->setCreatedAt(new \DateTime());

        $this->entityManager->persist($loyaltyPoint);

        $user->addLoyaltyPoint($loyaltyPoint);
        $loyaltyPoint->setUser($user);

        $this->entityManager->persist($user);
        $this->entityManager->persist($loyaltyPoint);



        $this->generateRandomTickets(10, $user);

        $this->entityManager->flush();

        $this->client->loginUser($user);

        $this->client->request('GET', '/api/client/dashboard/counters');

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('Content-Type', 'application/json');
    }

    private function generateRandomTickets(int $int, User $user)
    {
        $tickets = [];
        $status = [
            Ticket::STATUS_GENERATED,
            Ticket::STATUS_PRINTED,
            Ticket::STATUS_PENDING_VERIFICATION,
            Ticket::STATUS_WINNER,
        ];

        for ($i = 0; $i < $int; $i++) {
            $ticket = new Ticket();
            $ticket->setTicketCode('TICKETCODE' . $i. rand(1, 1000));
            $winDate = new \DateTime();
            $ticket->setWinDate($winDate);
            $ticket->setStatus($status[array_rand($status)]);
            $ticket->setTicketPrintedAt(new \DateTime());
            $ticket->setTicketGeneratedAt(new \DateTime());
            $ticket->setUpdatedAt(new \DateTime());
            $ticket->setUser($user);
            $user->addTicket($ticket);
            $ticket->setPrize(null);
            $ticket->setPrize(null);
            $this->entityManager->persist($user);
            $this->entityManager->persist($ticket);
            $tickets[] = $ticket;
        }
        return $tickets;
    }

    public function testGetAdminDashboardCounters(): void
    {
        // Make a request to fetch admin dashboard counters
        $this->client->request('POST', '/api/dashboard/admin', [], [], [], json_encode([
            'startDate' => '2024-01-01',
            'endDate' => '2024-12-31',
            'storeId' => 1,
        ]));

        // Assert that the response is successful
        $this->assertResponseIsSuccessful();

        // Assert that the response contains JSON content type
        $this->assertResponseHeaderSame('Content-Type', 'application/json');
    }

    /*

public function testGetDashboardStats(): void
{
    // Make a request to fetch dashboard stats
    $this->client->request('GET', '/api/dashboard/stats?startDate=2024-01-01&endDate=2024-12-31&storeId=1');

    // Assert that the response is successful
    $this->assertResponseIsSuccessful();

    // Assert that the response contains JSON content type
    $this->assertResponseHeaderSame('Content-Type', 'application/json');
}

*/

}
