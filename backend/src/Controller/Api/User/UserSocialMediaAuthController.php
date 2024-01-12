<?php
namespace App\Controller\Api\User;

use App\Entity\Role;
use App\Entity\User;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use League\OAuth2\Client\Provider\Google;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\Facebook;
use App\Entity\SocialMediaAccount;
use Doctrine\ORM\EntityManagerInterface;
class UserSocialMediaAuthController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function googleCallback(Request $request , JWTTokenManagerInterface $jwtManager)
    {
        try {

            $clientId = $_ENV['GOOGLE_CLIENT_ID'];
            $clientSecret = $_ENV['GOOGLE_CLIENT_SECRET'];
            $redirectUri = $_ENV['GOOGLE_REDIRECT_URI_DEV'];
            // Create a new instance of the Google provider
            $provider = new Google([
                'clientId' => $clientId,
                'clientSecret' => $clientSecret,
                'redirectUri' => $redirectUri,
            ]);


            $accessToken = $provider->getAccessToken('authorization_code', [
                'code' => $request->query->get('code'),
            ]);

            $googleUser = $provider->getResourceOwner($accessToken);



            $socialMediaAccountRepository = $this->entityManager->getRepository(SocialMediaAccount::class);
            $socialMediaAccount = $socialMediaAccountRepository->findOneBy(['google_id' => $googleUser->getId()]);



            if (!$socialMediaAccount) {
                $socialMediaAccount = new SocialMediaAccount();
                $socialMediaAccount->setGoogleId($googleUser->getId());

                $lastName = $googleUser->toArray()['family_name'];
                $firstName = $googleUser->toArray()['given_name'];
                $email = $googleUser->toArray()['email'];

                $emailAlreadyExist = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
                if($emailAlreadyExist){
                    return new JsonResponse(['error' => 'Email already exist' ,
                        'message' => 'Adresse email déjà utilisée'
                        ], 401);

                }


                $user = new User();
                $user->setEmail($email);
                $user->setFirstName($firstName);
                $user->setLastName($lastName);
                $user->setIsActive(true);
                $user->setActivitedAt(new \DateTime());
                $user->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_CLIENT]));
                $user->setSocialMediaAccount($socialMediaAccount);

                //$this->entityManager->persist($socialMediaAccount);
                //$this->entityManager->persist($user);
                //$this->entityManager->flush();

                $token = $jwtManager->create($socialMediaAccount->getUser());

                return new JsonResponse(['token' => $token ]);

                return new JsonResponse(['token' => $token , 'user' => $user->getUserJson() , 'message' => 'created']);
            }


            $token = $jwtManager->create($socialMediaAccount->getUser());

            return new JsonResponse(['token' => $token , 'user' => $socialMediaAccount->getUser()->getUserJson() , 'message' => 'loggedIn']);

        } catch (Exception $e) {

            return new JsonResponse(['error' => 'Authentication failed' ,
                'message' => $e->getMessage()
                ], 401);
        }
    }
}

