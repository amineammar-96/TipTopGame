<?php

namespace App\Controller\Api\Ticket;

use App\Entity\User;
use Exception;
use App\Entity\Role;
use App\Entity\Store;
use App\Entity\Ticket;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;


class TicketController extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;


    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;

    }



    public function getTicketByCode(string $code): JsonResponse
    {


        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('t')
            ->from(Ticket::class, 't');

        if ($code != "" && $code != null) {
            $qb->andWhere('t.ticket_code = :ticket_code')
                ->setParameter('ticket_code', $code);
        }


        $results = $qb->getQuery()->getResult();


        $jsonTickets= [];
        foreach ($results as $ticket) {
            $jsonTickets[] =
                $ticket->getTicketJson();
        }


        return $this->json([
            'tickets' => $jsonTickets,
        ], 200);
    }
    public function getTickets(Request $request): JsonResponse
    {

        $ticket_code =  $request->get('ticket_code' , null);
        $status =  $request->get('status' , null);
        $store =  $request->get('store' , null);
        $employee =  $request->get('caissier' , null);
        $client =  $request->get('client' , null);
        $prize =  $request->get('prize' , null);

        $page = $request->get('page' , 1);
        $limit = $request->get('limit' , 9);


        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('t')
            ->from(Ticket::class, 't');

        if ($ticket_code != "" && $ticket_code != null) {
            $qb->andWhere('t.ticket_code LIKE :ticket_code')
                ->setParameter('ticket_code', '%' . $ticket_code . '%');
        }

        if ($status != "" && $status != null) {
            $qb->andWhere('t.status = :status')
                ->setParameter('status', $status);
        }

        if ($store != "" && $store != null) {
            $qb->andWhere('t.store = :store')
                ->setParameter('store', $store);
        }

        if ($employee != "" && $employee != null) {
            $qb->innerJoin('t.employee', 'e')
                ->andWhere('e.firstname LIKE :employee or e.lastname LIKE :employee')
                ->setParameter('employee', '%' . $employee . '%');
        }

        if ($client != "" && $client != null && !intval($client)) {
            $qb->innerJoin('t.user', 'u')
                ->andWhere('u.firstname LIKE :employee or u.lastname LIKE :employee')
                ->setParameter('employee', '%' . $client . '%');
        }

        if ($client != "" && $client != null && intval($client)) {
            $qb->innerJoin('t.user', 'u')
                ->andWhere('u.id = :id')
                ->setParameter('id', $client);
        }

        if ($prize != "" && $prize != null) {
            $qb->innerJoin('t.prize', 'p')
                ->andWhere('p.id = :prize')
                ->setParameter('prize', $prize);

        }

        $userRole = $this->getUser()->getRoles()[0];
        if ($userRole == Role::ROLE_EMPLOYEE) {
            $qb->andWhere('t.employee = :employee')
                ->setParameter('employee', $this->getUser());
        }

        if ($userRole == Role::ROLE_STOREMANAGER) {
            $qb->andWhere('t.store = :store')
                ->setParameter('store', $this->getUser()->getStores()[0]);
        }

        if ($userRole == Role::ROLE_CLIENT) {
            $qb->andWhere('t.user = :user')
                ->setParameter('user', $this->getUser());
        }


        $totalCount = count($qb->getQuery()->getResult());




        $currentPage = $page ?? 1;
        $pageSize = $limit ?? 9;
        $qb->setFirstResult(($currentPage - 1) * $pageSize)
            ->setMaxResults($pageSize);

        $results = $qb->getQuery()->getResult();


        $jsonTickets= [];
        foreach ($results as $ticket) {
            $jsonTickets[] =
                $ticket->getTicketJson();
        }



        return $this->json([
            'tickets' => $jsonTickets,
            'totalCount' => $totalCount

        ], 200);
    }



    public function checkTicketForPlay(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $ticketCode = $data['ticketCode'] ?? null;

        $ticket = $this->entityManager->getRepository(Ticket::class)->findOneBy(
            ['ticket_code' => $ticketCode ,
                'status' => Ticket::STATUS_PRINTED,
                'store' => $this->getUser()->getStores()[0]
            ]
        );

        $finalStatus = [
            Ticket::STATUS_WINNER,
            Ticket::STATUS_PENDING_VERIFICATION,
        ];



        $ticketAux = $this->entityManager->getRepository(Ticket::class)->createQueryBuilder('t')
            ->where('t.ticket_code = :ticket_code')
            ->andWhere('t.status IN (:status)')
            ->andWhere('t.store = :store')
            ->setParameter('store', $this->getUser()->getStores()[0])
            ->setParameter('ticket_code', $ticketCode)
            ->setParameter('status', $finalStatus)
            ->getQuery()
            ->getResult();

        if (count($ticketAux) > 0) {
            return $this->json([
                'status' => "error",
                'message' => "Ticket already played",
            ], 404);
        }

        $prize = null;
        if ($ticket) {
            $prize = $ticket->getPrize();
        }



        if (!$ticket) {
            return $this->json([
                'status' => "error",
                'message' => "Ticket not found",
            ], 404);
        }


        return $this->json([
            'status' => "success",
            'prize' => $prize->getPrizeJson(),
            'ticket' => $ticket->getTicketJson(),
        ], 200);
    }


    public function printTicketByEmployee(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $ticketCode = $data['ticketCode'] ?? null;

        $user = $this->getUser();
        $userStore = $user->getStores()[0];
        $ticket = $this->entityManager->getRepository(Ticket::class)->createQueryBuilder('t')
            ->where('t.ticket_code = :ticket_code')
            ->setParameter('ticket_code', $ticketCode)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$ticket) {
            return $this->json([
                'status' => "error",
                'message' => "Ticket not found",
            ], 404);
        }


        $ticket->setTicketPrintedAt(new \DateTime());
        $ticket->setStatus(Ticket::STATUS_PRINTED);
        $ticket->setEmployee($user);
        $ticket->setStore($userStore);
        $ticket->setUpdatedAt(new \DateTime());
        $this->entityManager->persist($ticket);
        $this->entityManager->flush();


        return $this->json([
            'ticket' => $ticket->getTicketJson(),
        ], 200);

    }

    //confirmTicketPlay
    public function confirmTicketPlay(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $ticketCode = $data['ticketCode'] ?? null;

        $ticket = $this->entityManager->getRepository(Ticket::class)->findOneBy(
            ['ticket_code' => $ticketCode,
                'status' => Ticket::STATUS_PRINTED
            ]
        );

        if (!$ticket) {
            return $this->json([
                'status' => "error",
                'message' => "Ticket not found",
            ], 404);
        }

        $ticket->setUser($this->getUser());
        $ticket->setStatus(Ticket::STATUS_PENDING_VERIFICATION);
        $ticket->setUpdatedAt(new \DateTime());
        $ticket->setWinDate(new \DateTime());
        $this->entityManager->persist($ticket);
        $this->entityManager->flush();

        return $this->json([
            'ticket' => $ticket->getTicketJson(),
        ], 200);

    }
    public function confirmTicketGain(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $ticketId = $data['ticketId'] ?? null;


        $ticket = $this->entityManager->getRepository(Ticket::class)->findOneBy(
            ['id' => $ticketId,
                'status' => Ticket::STATUS_PENDING_VERIFICATION
            ]
        );

        if (!$ticket) {
            return $this->json([
                'status' => "error",
                'message' => "Ticket not found",
            ], 404);
        }

        $ticket->setStatus(Ticket::STATUS_WINNER);
        $ticket->setUpdatedAt(new \DateTime());
        $this->entityManager->persist($ticket);
        $this->entityManager->flush();

        return $this->json([
            'ticket' => $ticket->getTicketJson(),
        ], 200);

    }


    public function getWinnerTicketsHistory(Request $request): JsonResponse
    {

        $ticket_code = $request->get('ticket_code', null);
        $store = $request->get('store', null);
        $employee = $request->get('caissier', null);
        $client = $request->get('client', null);
        $prize = $request->get('prize', null);
        $employeeId = $request->get('employee', null);



        $page = $request->get('page', 1);
        $limit = $request->get('limit', 9);

        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('t')
            ->from(Ticket::class, 't');


        $qb->andWhere('t.status = :status')
            ->setParameter('status', Ticket::STATUS_WINNER);



        $qb->orderBy('t.updated_at', 'DESC');


        $totalCount = count($qb->getQuery()->getResult());

        $currentPage = $page ?? 1;
        $pageSize = $limit ?? 9;
        $qb->setFirstResult(($currentPage - 1) * $pageSize)
            ->setMaxResults($pageSize);

        $results = $qb->getQuery()->getResult();

        $jsonTickets = [];
        foreach ($results as $ticket) {
            $jsonTickets[] =
                $ticket->getTicketJson();
        }


        return $this->json([
            'gains' => $jsonTickets,
            'totalCount' => $totalCount

        ], 200);
    }
    public function getWinnerTickets(Request $request): JsonResponse
    {

        $ticket_code = $request->get('ticket_code', null);
        $store = $request->get('store', null);
        $employee = $request->get('caissier', null);
        $client = $request->get('client', null);
        $prize = $request->get('prize', null);
        $employeeId = $request->get('employee', null);



        $page = $request->get('page', 1);
        $limit = $request->get('limit', 9);

        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('t')
            ->from(Ticket::class, 't');


        $qb->andWhere('t.status = :status')
            ->setParameter('status', Ticket::STATUS_WINNER);


        if ($ticket_code != "" && $ticket_code != null) {
            $qb->andWhere('t.ticket_code LIKE :ticket_code')
                ->setParameter('ticket_code', '%' . $ticket_code . '%');
        }

        if ($store != "" && $store != null) {
            $qb->andWhere('t.store = :store')
                ->setParameter('store', $store);
        }

        if ($employee != "" && $employee != null) {
            $qb->innerJoin('t.employee', 'e')
                ->andWhere('e.firstname LIKE :employee or e.lastname LIKE :employee')
                ->setParameter('employee', '%' . $employee . '%');
        }

        if ($client != "" && $client != null && !intval($client)) {
            $qb->innerJoin('t.user', 'u')
                ->andWhere('u.firstname LIKE :employee or u.lastname LIKE :employee')
                ->setParameter('employee', '%' . $client . '%');
        }

        if ($client != "" && $client != null && intval($client)) {
            $qb->innerJoin('t.user', 'u')
                ->andWhere('u.id = :id')
                ->setParameter('id', $client);
        }

        if ($prize != "" && $prize != null) {
            $qb->innerJoin('t.prize', 'p')
                ->andWhere('p.id = :prize')
                ->setParameter('prize', $prize);
        }

        if ($employeeId != "" && $employeeId != null) {
            $qb->innerJoin('t.employee', 'e')
                ->andWhere('e.id = :employeeId')
                ->setParameter('employeeId', $employeeId);
        }

        $userRole = $this->getUser()->getRoles()[0];
        if ($userRole == Role::ROLE_EMPLOYEE) {
            $qb->andWhere('t.employee = :employee')
                ->setParameter('employee', $this->getUser());
        }

        if ($userRole == Role::ROLE_STOREMANAGER) {
            $qb->andWhere('t.store = :store')
                ->setParameter('store', $this->getUser()->getStores()[0]);
        }

        if ($userRole == Role::ROLE_CLIENT) {
            $qb->andWhere('t.user = :user')
                ->setParameter('user', $this->getUser());
        }

        $qb->orderBy('t.updated_at', 'DESC');


        $totalCount = count($qb->getQuery()->getResult());

        $currentPage = $page ?? 1;
        $pageSize = $limit ?? 9;
        $qb->setFirstResult(($currentPage - 1) * $pageSize)
            ->setMaxResults($pageSize);

        $results = $qb->getQuery()->getResult();

        $jsonTickets = [];
        foreach ($results as $ticket) {
            $jsonTickets[] =
                $ticket->getTicketJson();
        }


        return $this->json([
            'gains' => $jsonTickets,
            'totalCount' => $totalCount

        ], 200);
    }

}
