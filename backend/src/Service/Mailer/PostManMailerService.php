<?php

namespace App\Service\Mailer;

use App\Entity\EmailingHistory;
use App\Entity\EmailService;
use App\Entity\EmailTemplateVariable;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\RawMessage;
use Symfony\Component\Mime\Part\AbstractPart;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class PostManMailerService
{
    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    private string $mailtrapHost;
    private string $mailtrapUser;
    private string $mailtrapPassword;
    private string $mailtrapPort;

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @var Environment
     */
    private $twig;

    public function __construct(MailerInterface $mailer, string $mailtrapHost, string $mailtrapUser, string $mailtrapPassword, string $mailtrapPort, EntityManagerInterface $entityManager
    , Environment $twig)
    {
        $this->mailer = $mailer;
        $this->mailtrapHost = $mailtrapHost;
        $this->mailtrapUser = $mailtrapUser;
        $this->mailtrapPassword = $mailtrapPassword;
        $this->mailtrapPort = $mailtrapPort;
        $this->entityManager = $entityManager;
        $this->twig = $twig;


    }

    public function initMailer(): PHPMailer
    {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $this->mailtrapHost;
        $mail->SMTPAuth = true;
        $mail->Username = $this->mailtrapUser;
        $mail->Password = $this->mailtrapPassword;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $this->mailtrapPort;
        $mail->CharSet = 'UTF-8';

        return $mail;

    }

    /**
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function sendEmailTemplate($emailService , $receiver , $options): bool
    {

        $emailServiceEntity = $this->entityManager->getRepository(EmailService::class)->findOneBy(['name' => $emailService]);
        $emailServiceTemplates = $emailServiceEntity->getEmailTemplates();

        $recipient = '';
        $subject = '';
        $body = '';

        $template = null;

        foreach ($emailServiceTemplates as $emailServiceTemplate) {
            if ($emailServiceTemplate->getRequired()) {
                $template = $emailServiceTemplate;
                $recipient = "amineammar20@icloud.com";
                $subject = $emailServiceTemplate->getSubject();
                $body = $emailServiceTemplate->getContent();
            }
        }

        $getTokenExpirationDate = function ($receiver) {
                $token = $receiver->getToken();
                if ($token) {
                    $expirationDate = $receiver->getTokenExpiredAt();
                    if ($expirationDate) {
                        return $expirationDate->format('d/m/Y');
                    }
                }
                return '';
        };

        $activateAccountLinkClient = function ($receiver , $emailServiceEntity)  {
            if ($emailServiceEntity->getName() != EmailService::EMAILSERVICE_ACCOUNT_ACTIVATION_CLIENT) {
                return '';
            }


            $receiver_email = $receiver->getEmail();
            $token = $receiver->getToken();



            $link= 'http://localhost:3000/client/activate_account/?email='.$receiver_email.'&token='.$token;

            $wrapperBody = '<a href="' . $link . '" class="activateBtn">Vérifier mon compte</a>';


            return $wrapperBody;
        };

        $variableMappings = [
            'client_lastname' => $receiver->getLastname(),
            'client_firstname' => $receiver->getFirstname(),
            'client_email' => $receiver->getEmail(),
            'client_phone' => $receiver->getPhone(),
            'client_address' => $receiver->getUserPersonalInfo()?->getAddress(),
            'client_city' => $receiver->getUserPersonalInfo()?->getCity(),
            'client_country' => $receiver->getUserPersonalInfo()?->getCountry(),
            'client_zipcode' => $receiver->getUserPersonalInfo()?->getPostalCode(),
            'employee_lastname' => $receiver->getLastname(),
            'employee_firstname' => $receiver->getFirstname(),
            'employee_email' => $receiver->getEmail(),
            'employee_phone' => $receiver->getPhone(),
            'store_name' => $receiver->getStores()[0]?->getName(),
            'store_email' => $receiver->getStores()[0]?->getEmail(),
            'store_address' => $receiver->getStores()[0]?->getAddress(),
            'store_zipcode' => $receiver->getStores()[0]?->getPostalCode(),
            'store_city' => $receiver->getStores()[0]?->getCity(),
            'store_country' => $receiver->getStores()[0]?->getCountry(),
            'ticket_number' => $options ? $options['ticket'] ? '#'.$options['ticket']->getTicketCode() :'' :'' ,
            'ticket_created_at' => $options ? $options['ticket'] ? $options['ticket']->getCreatedAt()->format('d/m/Y') :'' :'' ,
            'ticket_printed_at' => $options ? $options['ticket'] ? $options['ticket']->getPrintDate()->format('d/m/Y') :'' :'' ,
            'ticket_confirmed_at' => $options ? $options['ticket'] ? $options['ticket']->getConfirmedAt()->format('d/m/Y') :'' :'' ,
            'reset_password_link' => 'getResetPasswordLink',
            'activate_account_link_client' => $activateAccountLinkClient($receiver , $emailServiceEntity),
            'activate_account_link_employee' => 'getActivateAccountLinkEmployee',
            'token_expiration_date' => $getTokenExpirationDate($receiver),
            'wheel_of_fortune_participation_link' => 'getWheelOfFortuneParticipationLink',
            'win_declaration_link' => 'getWinDeclarationLink',
            'password' => $options['password'] ?? '',
        ];





        $rawBody = $body;
        $body = $this->replacePlaceholders($rawBody, $variableMappings);
        $subject = $this->replacePlaceholders($subject, $variableMappings);

        $wrappedBody = $this->renderTemplate('email/wrapper.html.twig', ['content' => $body]);

        return $this->sendEmail($recipient, $subject, $wrappedBody, $emailService , $receiver);

        }

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    private function renderTemplate($template, $context): string
    {
        return $this->twig->render($template, $context);
    }

    private function replacePlaceholders($content, $variablesValues)
    {

        foreach ($variablesValues as $variable => $value) {
            $placeholder = '{{ ' . $variable . ' }}';
            $content = str_replace($placeholder, $value, $content);
        }

        return $content;
    }


        public function sendEmail($recipient, $subject, $body, $emailService , $receiver): bool
        {

            try {

                $mail = $this->initMailer();
                $mail->setFrom('your@example.com', 'Your Name');
                $mail->addAddress($recipient);

                $subject = $this->convertHtmlToText($subject);

                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->Body = $body;
                $mail->send();
                $this->createEmailingHistory($emailService , $receiver);
                return true;
            } catch (Exception $e) {
                return false;
            }
        }

        private
        function convertHtmlToText($subject): string
        {
            $subject = strip_tags($subject);
            return html_entity_decode($subject);
        }

    private function createEmailingHistory($emailService, $receiver): void
    {
        $emailService = $this->entityManager->getRepository(EmailService::class)->findOneBy(['name' => $emailService]);

        $emailingHistory = new EmailingHistory();
        $emailingHistory->setService($emailService);
        $emailingHistory->setReceiver($receiver);
        $emailingHistory->setSentAt(new DateTime());

        $this->entityManager->persist($emailingHistory);
        $this->entityManager->flush();
    }


}