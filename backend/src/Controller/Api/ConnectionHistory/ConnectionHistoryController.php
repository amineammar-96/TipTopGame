<?php

namespace App\Controller\Api\ConnectionHistory;


use App\Entity\ConnectionHistory;

use App\Entity\Role;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;


class ConnectionHistoryController extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;


    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }



    public function getConnectionsHistory(Request $request): JsonResponse
    {
        $store=  $request->get('store' , null);
        $role=  $request->get('role' , null);
        $user=  $request->get('user' , null);
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 10);
        $start_date = $request->get('start_date', null);
        $end_date = $request->get('end_date', null);

        $query = $this->entityManager->createQueryBuilder()
            ->select('ch')
            ->from(ConnectionHistory::class, 'ch')
            ->orderBy('ch.id', 'DESC');

        $connectionsHistoryCount = count($query->getQuery()->getResult());

        $page = $page ?? 1;
        $pageSize = $limit ?? 10;

        $query->setFirstResult(($page - 1) * $pageSize)
            ->setMaxResults($pageSize);

        if($store){
            $query->innerJoin('ch.user', 'u')
                ->andWhere('u.store = :store')
                ->setParameter('store', $store);
        }

        if($role){
            $roleEntity = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => $role]);

            $query->innerJoin('ch.user', 'u')
                ->andWhere('u.role = :role')
                ->setParameter('role' , $roleEntity);
        }

        if($user){
            $userEntity = $this->entityManager->getRepository(User::class)->find($user);

            $query->andWhere('ch.user = :user')
                ->setParameter('user' , $userEntity);
        }

        if($start_date){
            $query->andWhere('ch.created_at >= :start_date')
                ->setParameter('start_date', $start_date);
        }

        if($end_date){
            $query->andWhere('ch.created_at <= :end_date')
                ->setParameter('end_date', $end_date);
        }

        $connectionsHistory = $query->getQuery()->getResult();

        $data = [];

        foreach ($connectionsHistory as $connectionHistory) {
            $data[] = $connectionHistory->getConnectionHistoryJson();
        }

        return new JsonResponse([
            'connectionsHistory' => $data,
            'connectionsHistoryCount' => $connectionsHistoryCount,
        ], Response::HTTP_OK);


    }



}
