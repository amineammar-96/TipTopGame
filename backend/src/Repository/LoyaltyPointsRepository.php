<?php

namespace App\Repository;

use App\Entity\LoyaltyPoints;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<LoyaltyPoints>
 *
 * @method LoyaltyPoints|null find($id, $lockMode = null, $lockVersion = null)
 * @method LoyaltyPoints|null findOneBy(array $criteria, array $orderBy = null)
 * @method LoyaltyPoints[]    findAll()
 * @method LoyaltyPoints[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LoyaltyPointsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, LoyaltyPoints::class);
    }

//    /**
//     * @return LoyaltyPoints[] Returns an array of LoyaltyPoints objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('l.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?LoyaltyPoints
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }



}
