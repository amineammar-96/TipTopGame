<?php

namespace App\Controller\Api\User;

use App\Entity\User;
use Exception;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use App\Entity\Role;
use App\Entity\Store;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;

class UserController extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;



    /**
     * @var UserPasswordHasherInterface
     */
    private UserPasswordHasherInterface $passwordEncoder;


    public function __construct(EntityManagerInterface $entityManager , UserPasswordHasherInterface $passwordEncoder)
    {
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;

    }

    public function getUserProfileById(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['id' => $id]);
        if (!$user) {
            return $this->json([
                'error' => 'User not found'
            ], 404);
        }

        return new JsonResponse([
            'user' => $user->getUserJson()
        ]);
    }

    //updateUserProfileById
    public function updateUserProfileById(int $id, Request $request): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

        if (!$user) {
            return $this->json([
                'error' => 'User not found'
            ], 404);
        }

        $data = json_decode($request->getContent(), true);
        $user->setFirstName($data['firstname']);
        $user->setLastName($data['lastname']);

        if($data['email'] != $user->getEmail()){
            $oldUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if ($oldUser) {
                return $this->json([
                    'error' => 'Email already exists'
                ], 400);
            }
            $user->setEmail($data['email']);
        }



        $user->setPhone($data['phone']);
        $user->setStatus($data['status']);
        $user->setGender($data['gender']);



        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([
            'status' => 'updated',
            'user' => $user->getUserJson()
        ]);
    }


    public function getClients(Request $request): JsonResponse
    {


        $firstname =  $request->get('firstname' , null);
        $lastname =  $request->get('lastname' , null);
        $status =  $request->get('status' , null);
        $store =  $request->get('store' , null);
        $page = $request->get('page' , 1);
        $limit = $request->get('limit' , 10);
        $email =  $request->get('email' , null);
        $sexe =  $request->get('genre' , null);

        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('u')
            ->from(User::class, 'u')
            ->innerJoin('u.role', 'ur')
            ->where('ur.name = :role')
            ->setParameter('role', 'ROLE_CLIENT');



        if ($firstname != "" && $firstname != null) {
            $qb->andWhere('u.firstname LIKE :firstname')
                ->setParameter('firstname', '%' . $firstname . '%');
        }

        if ($lastname != "" && $lastname != null) {
            $qb->andWhere('u.lastname LIKE :lastname')
                ->setParameter('lastname', '%' . $lastname . '%');
        }

        if ($status != "" && $status != null) {
            $qb->andWhere('u.status = :status')
                ->setParameter('status', $status);
        }

        if ($store != "" && $store != null) {
            $qb->innerJoin('u.stores', 's')
                ->andWhere('s.id = :store')
                ->setParameter('store', $store);
        }

        if ($email != "" && $email != null) {
            $qb->andWhere('u.email LIKE :email')
                ->setParameter('email', '%' . trim($email) . '%');
        }

        if ($sexe != "" && $sexe != null) {
            $qb->andWhere('LOWER(u.gender) LIKE :gender')
                ->setParameter('gender', '%' . strtolower(trim($sexe)) . '%');
        }

        $userRole = $this->getUser()->getRoles()[0];
        if($userRole == Role::ROLE_STOREMANAGER){
            $qb->innerJoin('u.stores', 's')
                ->andWhere('s.id = :store')
                ->setParameter('store', $this->getUser()->getStores()[0]->getId());
        }


        $totalCount = count($qb->getQuery()->getResult());


        $page = $page ?? 1;
        $pageSize = $limit ?? 10;
        $qb->setFirstResult(($page - 1) * $pageSize)
            ->setMaxResults($pageSize);


        $users = $qb->getQuery()->getResult();



        $usersJson = [];
        foreach ($users as $user) {
            $usersJson[] =
                $user->getUserJson();
        }


        return $this->json([
            'users' => $usersJson,
            'totalCount' => $totalCount,
            'resultCount' => count($users),
            'status' => 'success',
        ]);
    }


    public function getParticipants(Request $request): JsonResponse
    {
        $firstname = $request->get('firstname', null);
        $lastname = $request->get('lastname', null);
        $status = $request->get('status', null);
        $store = $request->get('store', null);
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 10);
        $email = $request->get('email', null);
        $sexe = $request->get('genre', null);

        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('u')
            ->from(User::class, 'u')
            ->innerJoin('u.tickets', 't')
            ->innerJoin('u.role', 'ur')
            ->where('ur.name = :role')
            ->setParameter('role', 'ROLE_CLIENT');

        if ($firstname !== null && $firstname !== "") {
            $qb->andWhere('u.firstname LIKE :firstname')
                ->setParameter('firstname', '%' . $firstname . '%');
        }

        if ($lastname !== null && $lastname !== "") {
            $qb->andWhere('u.lastname LIKE :lastname')
                ->setParameter('lastname', '%' . $lastname . '%');
        }

        if ($status !== null && $status !== "") {
            $qb->andWhere('u.status = :status')
                ->setParameter('status', $status);
        }

        if ($store !== null && $store !== "") {
            $qb->innerJoin('u.stores', 's')
                ->andWhere('s.id = :store')
                ->setParameter('store', $store);
        }

        if ($email !== null && $email !== "") {
            $qb->andWhere('u.email LIKE :email')
                ->setParameter('email', '%' . trim($email) . '%');
        }

        if ($sexe !== null && $sexe !== "") {
            $qb->andWhere('LOWER(u.gender) LIKE :gender')
                ->setParameter('gender', '%' . strtolower(trim($sexe)) . '%');
        }

        $userRole = $this->getUser()->getRoles()[0];
        if ($userRole == Role::ROLE_STOREMANAGER) {
            $qb->innerJoin('u.stores', 's')
                ->andWhere('s.id = :store')
                ->setParameter('store', $this->getUser()->getStores()[0]->getId());
        }

        $qbAux = clone $qb;
        $totalCount = count($qbAux->getQuery()->getResult());

        $page = $page ?? 1;
        $pageSize = $limit ?? 10;
        $paginator = new ORMPaginator($qb);

        $totalCount = count($paginator);

        $paginator->getQuery()
            ->setFirstResult(($page - 1) * $pageSize)
            ->setMaxResults($pageSize);

        $users = $paginator->getIterator()->getArrayCopy();

        $usersJson = [];
        foreach ($users as $user) {
            $usersJson[] =
                $user->getUserJson();
        }

        return $this->json([
            'users' => $usersJson,
            'totalCount' => $totalCount,
            'resultCount' => count($users),
            'status' => 'success',
        ]);
    }


    public function getStoreClients(int $id): JsonResponse
    {
        $store = $this->entityManager->getRepository(Store::class)->findOneBy(['id' => $id]);
        if (!$store) {
            return $this->json([
                'error' => 'Store not found'
            ], 404);
        }

        $users = $store->getUsers();

        $usersJson = [];
        foreach ($users as $user) {
            $userRole = $user->getRoles()[0];
            if ($userRole == Role::ROLE_CLIENT) {
                $usersJson[] =
                    $user->getUserJson();
            }
        }

        return $this->json([
            'users' => $usersJson,
            'status' => 'success',
        ]);
    }

    //getEmployeesList
    public function getEmployeesList(Request $request): JsonResponse
    {

        $store =  $request->get('store' , null);

        $qb = $this->entityManager->createQueryBuilder('u');
        $qb->select('u')
            ->from(User::class, 'u')
            ->innerJoin('u.role', 'ur')
            ->where('ur.name = :role')
            ->setParameter('role', 'ROLE_EMPLOYEE');

        if ($store != "" && $store != null) {
            $qb->innerJoin('u.stores', 's')
                ->andWhere('s.id = :store')
                ->setParameter('store', $store);
        }


        $users = $qb->getQuery()->getResult();

        $usersJson = [];
        foreach ($users as $user) {
            $usersJson[] =
                $user->getUserJson();
        }

        return $this->json([
            'users' => $usersJson,
            'status' => 'success',
        ]);

    }
}
