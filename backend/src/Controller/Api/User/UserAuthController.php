<?php
// src/Controller/ApiController.php

namespace App\Controller\Api\User;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Symfony\Component\Serializer\SerializerInterface;
use App\Entity\Role;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class UserAuthController extends AbstractController {
    /**
    * @var EntityManagerInterface
    */
    private $entityManager;

    private UserPasswordHasherInterface $passwordEncoder;

    public function __construct( EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordEncoder ) {
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;

    }

    /**
     * @param Request $request
     * @param JWTTokenManagerInterface $jwtManager
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function checkLoginAdmin( Request $request, JWTTokenManagerInterface $jwtManager, SerializerInterface $serializer ): JsonResponse
    {
        try {
            $secretKey = $_ENV[ 'JWT_SECRET_KEY' ];
            $publicKey = $_ENV[ 'JWT_PUBLIC_KEY' ];
            $passphrase = $_ENV[ 'JWT_PASSPHRASE' ];

            $data = json_decode( $request->getContent(), true );

            $userFormData = [
                'email' => $data['email'],
                'password' => $data['password'],
            ];


            $user = null;
            if ( $userFormData['email'] && $userFormData['password'] ) {
                $user = $this->entityManager->getRepository( User::class )->findOneBy( [ 'email' => $userFormData[ 'email' ] ] );
                $plainPassword = $userFormData[ 'password' ];
                if ( $user ) {
                    if ( !$this->passwordEncoder->isPasswordValid( $user, $plainPassword ) ) {
                        return new JsonResponse( [ 'error' => 'Invalid credentials' ], 401 );
                    }
                }
            }

            if ( !$user ) {
                return new JsonResponse( [ 'error' => 'Authentication failed' , 'message' => "user not found" ], 401 );
            }else if ( $user->getRole()->getName() === Role::ROLE_CLIENT ) {
                return new JsonResponse( [ 'error' => 'Authentication failed' , 'message' => "user is not an admin" ], 401 );
            }

        } catch ( JWTDecodeFailureException $e ) {
            return new JsonResponse( [ 'error' => 'Invalid token' ], 401 );
        }

        $token = $jwtManager->create( $user );
        $dateOfBirth = $user->getDateOfBirth();

        $currentDate = new \DateTime();

        $ageInterval = $dateOfBirth->diff( $currentDate );

        $age = $ageInterval->y;

        $userJson = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'lastname' => $user->getLastname(),
            'firstname' => $user->getFirstname(),
            'gender' => $user->getGender(),
            'dateOfBirth' => $user->getDateOfBirth(),
            'age' => $age,
            'role' => $user->getRoles()[ 0 ],
            'store' => $user->getUserStoresJson(),

        ];

        return new JsonResponse( [
            'status' => 'success',
            'userJson' => $userJson,
            'token' => $token,
        ] );
    }


    /**
     * @param Request $request
     * @param JWTTokenManagerInterface $jwtManager
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function checkLoginClient( Request $request, JWTTokenManagerInterface $jwtManager, SerializerInterface $serializer ): JsonResponse
    {
        try {
            $secretKey = $_ENV[ 'JWT_SECRET_KEY' ];
            $publicKey = $_ENV[ 'JWT_PUBLIC_KEY' ];
            $passphrase = $_ENV[ 'JWT_PASSPHRASE' ];

            $data = json_decode( $request->getContent(), true );

            $userFormData = [
                'email' => $data['email'],
                'password' => $data['password'],
            ];


            $user = null;
            if ( $userFormData['email'] && $userFormData['password'] ) {
                $user = $this->entityManager->getRepository( User::class )->findOneBy( [ 'email' => $userFormData[ 'email' ] ] );
                $plainPassword = $userFormData[ 'password' ];
                if ( $user ) {
                    if ( !$this->passwordEncoder->isPasswordValid( $user, $plainPassword ) ) {
                        return new JsonResponse( [ 'error' => 'Invalid credentials' ], 401 );
                    }

                }
            }

            if ( !$user ) {
                return new JsonResponse( [ 'error' => 'Authentication failed' ], 401 );
            }else if ( $user->getRole()->getName() !== Role::ROLE_CLIENT ) {
                return new JsonResponse( [ 'error' => 'Authentication failed' , 'message' => "user is not a client" ], 401 );
            }

        } catch ( JWTDecodeFailureException $e ) {
            return new JsonResponse( [ 'error' => 'Invalid token' ], 401 );
        }

        $token = $jwtManager->create( $user );
        $dateOfBirth = $user->getDateOfBirth();

        $currentDate = new \DateTime();

        $ageInterval = $dateOfBirth->diff( $currentDate );

        $age = $ageInterval->y;

        $userJson = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'lastname' => $user->getLastname(),
            'firstname' => $user->getFirstname(),
            'gender' => $user->getGender(),
            'dateOfBirth' => $user->getDateOfBirth(),
            'age' => $age,
            'role' => $user->getRoles()[0],
            'stores' => $user->getUserStoresJson(),
        ];

        $firstLogin = count( $user->getStores() ) === 0;

        return new JsonResponse( [
            'status' => 'success',
            'firstLogin' => $firstLogin,
            'userJson' => $userJson,
            'token' => $token,
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function register( Request $request ): JsonResponse
    {

        try {
            $data = json_decode( $request->getContent(), true );

            $email = $data[ 'email' ];
            $password = $data[ 'password' ];
            $firstname = $data[ 'firstname' ];
            $lastname = $data[ 'lastname' ];
            $gender = $data[ 'gender' ];
            $role = $data[ 'role' ];

            foreach ( $data as $key => $dataIndex ) {
                if ( $dataIndex === '' ) {
                    return new JsonResponse( [
                        'status' => 'failed',
                        'error' => 'Empty field - '.$key ], 400 );
                    }
                }

                $dateFormat = 'd/m/Y';
                $dateOfBirthString = $data[ 'dateOfBirth' ];
                $dateOfBirth = \DateTime::createFromFormat( $dateFormat, $dateOfBirthString );

                $existingUser = $this->entityManager->getRepository( User::class )->findOneBy( [ 'email' => $email ] );

                if ( $existingUser ) {
                    return new JsonResponse( [ 'error' => 'Email already registered' ], 400 );
                }

                $role = $this->entityManager->getRepository( Role::class )->findOneBy( [
                    'name' => $role,
                ] );

                if ( $email !== '' && $password !== '' && $lastname !== '' && $firstname !== '' && $gender !== '' && $role !== '' ) {
                    $user = new User();
                    $user->setEmail( $email );
                    $user->setFirstname( $firstname );
                    $user->setLastname( $lastname );
                    $user->setGender( $gender );
                    $user->setDateOfBirth( $dateOfBirth );
                    $hashedPassword = $this->passwordEncoder->hashPassword( $user, $password );
                    $user->setPassword( $hashedPassword );
                    $user->setRole( $role );
                    $user->setStatus( User::STATUS_OPEN );
                    $this->entityManager->persist( $user );
                    $this->entityManager->flush();

                    return new JsonResponse( [ 'status' => 'success', 'message' => 'User registered successfully' ], 200 );
                } else {
                    return new JsonResponse( [ 'status' => 'failed', 'message' => 'User register failed' ], 400 );
                }
            } catch ( \Throwable $th ) {
                return new JsonResponse( [ 'status' => 'failed', 'message' => $th->getMessage() ], 400 );
            }

        }
    }
