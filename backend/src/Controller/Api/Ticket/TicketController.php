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

    /**
     * @IsGranted("ROLE_ADMIN")
     */
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

        /*
        $sortField = isset($data['column']) ? $data['column']['dataIndex'] : null;
        $sortOrder = isset($data['order']) ? $data['order'] : null;

        if($sortOrder){
            $sortOrder = strtolower($sortOrder) === 'descend' ? 'DESC' : 'ASC';
        }

        if ($sortField && $sortOrder && $sortField!='age') {
            $qb->orderBy("u.$sortField", $sortOrder);
        }else if ($sortField && $sortOrder && $sortField=='age') {
            $qb->orderBy('u.date_of_birth', $sortOrder);
        }



        $roleFilter = $data['role'] ?? null;
        if ($roleFilter != "" && $roleFilter != null) {
            $qb->andWhere('ur.name = :role')
                ->setParameter('role', $roleFilter);
        }

        */
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

        if ($client != "" && $client != null) {
            $qb->innerJoin('t.user', 'u')
                ->andWhere('u.firstname LIKE :employee or u.lastname LIKE :employee')
                ->setParameter('employee', '%' . $client . '%');
        }

        if ($prize != "" && $prize != null) {
            $qb->innerJoin('t.prize', 'p')
                ->andWhere('p.id = :prize')
                ->setParameter('prize', $prize);

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

        //$ticketCounter = $this->entityManager->getRepository(Ticket::class)->getTicketCountByStatus($tickets);


        return $this->json([
            'tickets' => $jsonTickets,
            'totalCount' => $totalCount

        ], 200);
    }



    public function checkTicketForPlay(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $ticketCode = $data['ticketCode'] ?? null;

        $ticket = $this->entityManager->getRepository(Ticket::class)->findOneBy(['ticket_code' => $ticketCode]);
        $prize = null;
        if ($ticket) {
            $prize = $ticket->getPrize();
        }

        if ($ticket) {
        if ($ticket->getStatus() == Ticket::STATUS_GENERATED) {
            return $this->json([
                'status' => "success",
                'prize' => $prize->getPrizeJson(),
                'ticket' => $ticket->getTicketJson(),
            ], 200);
        }
        }

        if ($ticket) {
            if ($ticket->getStatus() == Ticket::STATUS_WINNER) {
                return $this->json([
                    'status' => "error",
                    'message' => "Ticket already played",
                ], 404);
            }
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

}
