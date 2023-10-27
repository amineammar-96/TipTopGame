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
}
