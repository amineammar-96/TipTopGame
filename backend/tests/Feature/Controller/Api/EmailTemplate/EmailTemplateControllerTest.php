<?php

namespace App\Tests\Feature\Controller\Api\EmailTemplate;

use App\Entity\EmailTemplate;
use App\Entity\Role;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class EmailTemplateControllerTest extends WebTestCase
{
    private $client;

    private $entityManager;

    private $passwordEncoder;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        $this->passwordEncoder = $this->client->getContainer()->get(UserPasswordHasherInterface::class);

    }

    public function testGetEmailTemplates(): void
    {

        $admin = new User();
        $admin->setEmail('admin@tiptop.com');
        $admin->setPassword($this->passwordEncoder->hashPassword($admin, 'password'));
        $admin->setIsActive(true);
        $admin->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_ADMIN']));
        $admin->setCreatedAt(new \DateTime());
        $admin->setUpdatedAt(new \DateTime());
        $admin->setDateOfBirth(new \DateTime());
        $admin->setFirstName('Test');
        $admin->setLastName('User');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);
        $this->entityManager->persist($admin);

        $this->entityManager->flush();

        $this->client->loginUser($admin);
        $this->client->request('GET', '/api/admin/correspondence_templates');

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $this->assertIsArray(json_decode($this->client->getResponse()->getContent(), true));

        $this->assertArrayHasKey('id', json_decode($this->client->getResponse()->getContent(), true)[0]);
        $this->assertArrayHasKey('title', json_decode($this->client->getResponse()->getContent(), true)[0]);
        $this->assertArrayHasKey('subject', json_decode($this->client->getResponse()->getContent(), true)[0]);
        $this->assertArrayHasKey('content', json_decode($this->client->getResponse()->getContent(), true)[0]);
        $this->assertArrayHasKey('type', json_decode($this->client->getResponse()->getContent(), true)[0]);
        $this->assertArrayHasKey('service', json_decode($this->client->getResponse()->getContent(), true)[0]);
        $this->assertArrayHasKey('required', json_decode($this->client->getResponse()->getContent(), true)[0]);
        $this->assertArrayHasKey('description', json_decode($this->client->getResponse()->getContent(), true)[0]);
        $this->assertArrayHasKey('name', json_decode($this->client->getResponse()->getContent(), true)[0]);
        $this->assertArrayHasKey('variables', json_decode($this->client->getResponse()->getContent(), true)[0]);

        $this->assertGreaterThan(0, count(json_decode($this->client->getResponse()->getContent(), true)));
    }


    public function testGetEmailTemplateById(): void
    {
        $admin = new User();
        $admin->setEmail('admin@tiptop.com');
        $admin->setPassword($this->passwordEncoder->hashPassword($admin, 'password'));
        $admin->setIsActive(true);
        $admin->setRole($this->entityManager->getRepository(Role::class)->findOneBy(['name' => 'ROLE_ADMIN']));
        $admin->setCreatedAt(new \DateTime());
        $admin->setUpdatedAt(new \DateTime());
        $admin->setDateOfBirth(new \DateTime());
        $admin->setFirstName('Test');
        $admin->setLastName('User');
        $admin->setGender('Homme');
        $admin->setPhone('123456789');
        $admin->setStatus(true);
        $this->entityManager->persist($admin);

        $this->entityManager->flush();

        $this->client->loginUser($admin);
        $emailTemplate = $this->entityManager->getRepository(EmailTemplate::class)->findOneBy([]);

        $this->client->request('GET', '/api/admin/correspondence_template/' . $emailTemplate->getId());

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $this->assertJsonStringEqualsJsonString(
            json_encode([
                'id' => $emailTemplate->getId(),
                'title' => $emailTemplate->getTitle(),
                'subject' => $emailTemplate->getSubject(),
                'content' => $emailTemplate->getContent(),
                'type' => $emailTemplate->getType(),
                'service' => $emailTemplate->getService()->getId(),
                'required' => $emailTemplate->getRequired(),
                'description' => $emailTemplate->getDescription(),
                'name' => $emailTemplate->getName(),
                'variables' => $emailTemplate->getService()->getVariablesJson(),
            ]),
            $this->client->getResponse()->getContent()
        );
    }


    public function testCreateEmailTemplate(): void
    {
        // Make a request to create a new email template
        $this->client->request(
            'POST',
            '/api/email_templates',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'title' => 'Test Template',
                'name' => 'Test Name',
                'description' => 'Test Description',
                'type' => 'Test Type',
                'service' => $this->entityManager->
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $this->assertJsonStringEqualsJsonString(
            json_encode(['message' => 'Template created successfully']),
            $this->client->getResponse()->getContent()
        );
    }

    /*
    public function testUpdateEmailTemplateById(): void
    {
        // Get an email template from the database
        $emailTemplate = $this->entityManager->getRepository(\App\Entity\EmailTemplate::class)->findOneBy([]);

        // Make a request to update the email template
        $this->client->request(
            'PUT',
            '/api/email_templates/' . $emailTemplate->getId(),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'title' => 'Updated Test Template',
                'name' => 'Updated Test Name',
                'description' => 'Updated Test Description',
                'type' => 'Updated Test Type',
                'service' => 1, // Assuming service ID exists in the database
                'subject' => 'Updated Test Subject',
                'content' => 'Updated Test Content',
                'required' => false,
            ])
        );

        // Assert that the response is successful
        $this->assertResponseIsSuccessful();

        // Assert that the response contains the expected message
        $this->assertJsonStringEqualsJsonString(
            json_encode(['message' => 'Template a été mis à jour avec succès', 'statusCode' => 200]),
            $this->client->getResponse()->getContent()
        );
    }

    public function testDeleteTemplate(): void
    {
        // Get an email template from the database
        $emailTemplate = $this->entityManager->getRepository(\App\Entity\EmailTemplate::class)->findOneBy([]);

        // Make a request to delete the email template
        $this->client->request('DELETE', '/api/email_templates/' . $emailTemplate->getId());

        // Assert that the response is successful
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }
    */
}
