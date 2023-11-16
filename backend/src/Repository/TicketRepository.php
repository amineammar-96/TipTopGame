<?php

namespace App\Repository;

use App\Entity\Ticket;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Ticket>
 *
 * @method Ticket|null find($id, $lockMode = null, $lockVersion = null)
 * @method Ticket|null findOneBy(array $criteria, array $orderBy = null)
 * @method Ticket[]    findAll()
 * @method Ticket[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TicketRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ticket::class);
    }

    public function findByDateAndStore($startDate, $endDate, $store)
    {
        $startDate = \DateTime::createFromFormat('d/m/Y', $startDate)->format('Y-m-d H:i:s');
        $endDate = \DateTime::createFromFormat('d/m/Y', $endDate)->format('Y-m-d H:i:s');

        $qb = $this->createQueryBuilder('t')
            ->andWhere('t.updated_at BETWEEN :startDate AND :endDate')
            ->andWhere('t.updated_at IS NOT NULL')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate);

        if ($store) {
            $qb->andWhere('t.store = :store')
                ->setParameter('store', $store);
        }

        return $qb
            ->getQuery()
            ->getResult();
    }



    /**
     * @param array $tickets
     * @return array
     */
    public function getTicketCountByStatus(array $tickets): array
    {
        $ticketCounter = [];
        foreach ($tickets as $ticket) {
            $ticketCounter[$ticket->getStatus()][] = $ticket;
        }
        return $ticketCounter;
    }
}
