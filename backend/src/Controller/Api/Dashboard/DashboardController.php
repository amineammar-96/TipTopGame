<?php

namespace App\Controller\Api\Dashboard;

use App\Entity\Ticket;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundatio\Request;
use Doctrine\ORM\EntityManagerInterface;


class DashboardController extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;



    public function __construct(EntityManagerInterface $entityManager )
    {
        $this->entityManager = $entityManager;

    }


    public function getClientDashboardCounters(): JsonResponse
    {
        $user = $this->getUser();
        $tickets = $user->getTickets();

        $counters = [
            'tickets' => count($tickets),
            'playedTickets' => 0,
            'confirmedTickets' => 0,
            'pendingTickets' => 0,
        ];

        foreach ($tickets as $ticket) {
            if ($ticket->getStatus() == Ticket::STATUS_PENDING_VERIFICATION || $ticket->getStatus() == Ticket::STATUS_WINNER) {
                $counters['playedTickets']++;
            }
            if ($ticket->getStatus() == Ticket::STATUS_WINNER) {
                $counters['confirmedTickets']++;
            }
            if ($ticket->getStatus() == Ticket::STATUS_PENDING_VERIFICATION) {
                $counters['pendingTickets']++;
            }
        }

        return $this->json([
            'counters' => $counters,
        ]);
    }


    public function getAdminDashboardCounters(): JsonResponse
    {
        $counters = [
            'tickets' => 0,
            'printedTickets' => 0,
            'ticketStock' => 0,
            'clients' => 0,
            'participants' => 0,
            'playedTicket' => 0,
        ];

        $tickets = $this->entityManager->getRepository(Ticket::class)->findAll();
        $counters['tickets'] = count($tickets);

        foreach ($tickets as $ticket) {
            if ($ticket->getStatus() != Ticket::STATUS_GENERATED) {
                $counters['printedTickets']++;
            }

            if ($ticket->getStatus() == Ticket::STATUS_PENDING_VERIFICATION || $ticket->getStatus() == Ticket::STATUS_WINNER) {
                $counters['playedTicket']++;
            }
        }

        $counters['ticketStock'] = $counters['tickets'] - $counters['printedTickets'];

        $users = $this->entityManager->getRepository(User::class)->findAll();
        foreach ($users as $user) {
            if ($user->getRoles()[0] == 'ROLE_CLIENT') {
                $counters['clients']++;
            }
            if ($user->getRoles()[0] == 'ROLE_CLIENT' && count($user->getTickets()) > 0) {
                $counters['participants']++;
            }
        }


        return $this->json([
            'counters' => $counters,
        ]);
    }

}
