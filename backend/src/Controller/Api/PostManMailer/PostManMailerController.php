<?php

namespace App\Controller\Api\PostManMailer;

use App\Entity\EmailService;
use App\Entity\Prize;
use App\Entity\Role;
use App\Entity\Ticket;
use App\Entity\User;
use App\Service\Mailer\PostManMailerService;
use DateTime;
use PHPUnit\Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;


class PostManMailerController extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    private PostManMailerService $postManMailerService;



    public function __construct(EntityManagerInterface $entityManager , PostManMailerService $postManMailerService )
    {
        $this->entityManager = $entityManager;
        $this->postManMailerService = $postManMailerService;

    }



    public function sendEmail(Request $request): JsonResponse
    {
            $randomId = rand(20, 150);
            $receiver = $this->entityManager->getRepository(User::class)->findOneBy(['id' => $randomId]);

            $emailServices = $this->entityManager->getRepository(EmailService::class)->findAll();

            $randomEmailService = $emailServices[array_rand($emailServices)];

            try {
                if ($this->postManMailerService->sendEmailTemplate($randomEmailService->getName() , $receiver , [])) {
                    return new jsonResponse('Email sent successfully!');
                } else {
                    return new jsonResponse('Email could not be sent.', 500);
                }
            } catch (Exception|LoaderError|RuntimeError|SyntaxError $e) {
                return new JsonResponse('Email could not be sent.', 500);
            }
    }





    public function sendActivationEmail(int $id , Request $request): JsonResponse
    {
        $receiver = $this->entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

        $activationEmailServiceClient =EmailService::EMAILSERVICE_ACCOUNT_ACTIVATION_CLIENT ;
        $activationEmailServiceEmployee = EmailService::EMAILSERVICE_ACCOUNT_ACTIVATION_EMPLOYEE ;

        $receiverRole = $receiver->getRoles()[0];

        if ($receiverRole == Role::ROLE_CLIENT) {
            $finalService = $activationEmailServiceClient;
        } else {
            $finalService = $activationEmailServiceEmployee;
        }

        $activationToken = bin2hex(random_bytes(32));
        $receiver->setToken($activationToken);
        $receiver->setTokenExpiredAt((new \DateTime())->modify('+1 day'));

        $this->entityManager->persist($receiver);
        $this->entityManager->flush();


        try {
            if ($this->postManMailerService->sendEmailTemplate($finalService , $receiver , [
                'token' => $activationToken,
                'ticket' => null,

            ])) {
                return new jsonResponse('Activation Email sent successfully!');
            } else {
                return new jsonResponse('Email could not be sent.', 500);
            }
        } catch (Exception|LoaderError|RuntimeError|SyntaxError $e) {
            return new JsonResponse('Email could not be sent.', 500);
        }

    }


    public function checkClientActivationTokenValidity(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'];
        $token = $data['token'];
        $linkStatus = $this->entityManager->getRepository(User::class)->checkClientActivationTokenValidity($email,$token);

        if ($linkStatus) {
            $this->entityManager->getRepository(User::class)->activateUserAccount($email);
            return new JsonResponse('Token is valid' , 200);
        } else {
            return new JsonResponse('Token is not valid', 500);
        }
    }

}
