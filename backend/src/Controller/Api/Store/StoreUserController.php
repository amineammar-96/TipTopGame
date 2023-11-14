<?php

namespace App\Controller\Api\Store;

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


class StoreUserController extends AbstractController
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



    public function getStoreUsersForAdmin(int $id): JsonResponse
    {
        $store = $this->entityManager->getRepository(Store::class)->findOneBy(['id' => $id]);
        if (!$store) {
            return $this->json([
                'error' => 'Store not found'
            ], 404);
        }

        $storeUsers = $store->getUsers();

        $storeManagerUsers = [];
        $storeEmployeeUsers = [];
        $storeClientUsers = [];

        foreach ($storeUsers as $storeUser) {
            if ($storeUser->getRole()->getName() == Role::ROLE_STOREMANAGER) {
                $storeManagerUsers[] = $storeUser->getUserJson();
            } else if ($storeUser->getRole()->getName() == Role::ROLE_EMPLOYEE) {
                $storeEmployeeUsers[] = $storeUser->getUserJson();
            }else if ($storeUser->getRole()->getName() == Role::ROLE_CLIENT) {
                $storeClientUsers[] = $storeUser->getUserJson();
            }
        }

        return new JsonResponse([
            'storeManagerUsers' => $storeManagerUsers,
            'storeEmployeeUsers' => $storeEmployeeUsers,
            'storeClientUsers' => $storeClientUsers,
            'storeManagerUsersCount' => count($storeManagerUsers),
            'storeEmployeeUsersCount' => count($storeEmployeeUsers),
            'storeClientUsersCount' => count($storeClientUsers),

        ]);
    }


    public function getStoreUsersByRole(int $id , Request $request  ): JsonResponse
    {
        $store = $this->entityManager->getRepository(Store::class)->findOneBy(['id' => $id]);
        if (!$store) {
            return $this->json([
                'error' => 'Store not found'
            ], 404);
        }

        // Initialize the query builder
        $qb = $this->entityManager->createQueryBuilder();
        $data = json_decode($request->getContent(), true);


        // Select statement
        $qb->select('u')
            ->from(User::class, 'u')
            ->innerJoin('u.stores', 's')
            ->innerJoin('u.role', 'ur')
            ->where('s.id = :store_id')
            ->setParameter('store_id', $id);

        // Sorting
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

        $filters = $data['filters'] ?? null;
        if (!empty($filters)) {
            if($filters['status']!=null && $filters['status']!='') {
                $qb->andWhere($qb->expr()->in('u.status', $filters['status']));
            }
            if($filters['gender']!=null && $filters['gender']!='') {
                $qb->andWhere($qb->expr()->in('u.gender', $filters['gender']));
            }
        }

        $totalCount = count($qb->getQuery()->getResult());

        // Pagination


        $page = $data['pagination']['current'] ?? 1;
        $pageSize = $data['pagination']['pageSize'] ?? 10;
        $qb->setFirstResult(($page - 1) * $pageSize)
            ->setMaxResults($pageSize);

        // Execute the query
        $results = $qb->getQuery()->getResult();

        // Convert results to JSON
        $storeManagerUsers = [];
        foreach ($results as $result) {
            $storeManagerUsers[] = $result->getUserJson();
        }

        return new JsonResponse([
            'storeManagerUsers' => $storeManagerUsers,
            'totalCount' => $totalCount
        ]);
    }

    public function addNewUserToStore(int $id, Request $request): JsonResponse
    {
        $store = $this->entityManager->getRepository(Store::class)->findOneBy(['id' => $id]);
        if (!$store) {
            return $this->json([
                'error' => 'Store not found'
            ], 404);
        }

        $data = json_decode($request->getContent(), true);


        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($user) {
            return $this->json([
                'error' => 'E-mail already in use'
            ], 400);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstName($data['firstname']);
        $user->setLastName($data['lastname']);
        $user->setPhone($data['phone']);
        $user->setGender($data['gender']);

        $dateFormat = 'd/m/Y';
        $dateOfBirthString = $data[ 'dateOfBirth' ];
        $dateOfBirth = \DateTime::createFromFormat( $dateFormat, $dateOfBirthString );
        $user->setDateOfBirth($dateOfBirth);

        if($data['status']!=null && $data['status']!='') {
            $user->setStatus($data['status']);
        }else{
            $user->setStatus(User::STATUS_OPEN);
        }

        $generatedPassword = $this->generateNewPassword($user);
        $hashedPassword = $this->passwordEncoder->hashPassword( $user, $generatedPassword );
        $user->setPassword( $hashedPassword );

        $role = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => $data['role']]);
        if (!$role) {
            return $this->json([
                'error' => 'Role not found'
            ], 404);
        }
        $user->setRole($role);
        $user->addStore($store);
        $store->addUser($user);


        $this->entityManager->persist($store);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([
            'user' => $user->getUserJson()
        ]);

    }

    /**
     * @param User $user
     * @return string
     */
    protected function generateNewPassword( User $user ): string {
        if(strlen($user->getFirstname()) > 1 && strlen($user->getLastname()) > 3) {
            return strtolower(substr($user->getLastname(), 0, 4))
                . strtolower(substr($user->getFirstname(), 0, 1));
        }else {
            return 'tiptop123';
        }
    }

}
