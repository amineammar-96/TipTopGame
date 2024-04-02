<?php

namespace App\Tests\Command;

use App\Command\CreateDefaultRoles;
use App\Entity\Role;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\DBAL\Connection;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

class CreateDefaultRolesTest extends TestCase
{
    private $entityManager;
    private $connection;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->connection = $this->createMock(Connection::class);
    }

    public function testExecute(): void
    {
        // Create a new instance of the command
        $command = new CreateDefaultRoles($this->entityManager, $this->connection);

        // Create a new application and add the command to it
        $application = new Application();
        $application->add($command);

        // Create a CommandTester to execute the command
        $commandTester = new CommandTester($command);

        // Expectations for the executeQuery method
        $this->connection->expects($this->exactly(6))
            ->method('executeQuery')
            ->withConsecutive(
                ['SET SQL_SAFE_UPDATES = 0'],
                ['SET FOREIGN_KEY_CHECKS=0'],
                ['DELETE FROM role'],
                ['ALTER TABLE role AUTO_INCREMENT = 1'],
                ['SET FOREIGN_KEY_CHECKS=1'],
                ['SET SQL_SAFE_UPDATES = 1']
            );

        // Expectations for persist and flush methods
        $this->entityManager->expects($this->exactly(6))
            ->method('persist')
            ->withConsecutive(
                [$this->isInstanceOf(Role::class)],
                [$this->isInstanceOf(Role::class)],
                [$this->isInstanceOf(Role::class)],
                [$this->isInstanceOf(Role::class)],
                [$this->isInstanceOf(Role::class)],
                [$this->isInstanceOf(Role::class)]
            );

        $this->entityManager->expects($this->once())
            ->method('flush');

        // Execute the command
        $commandTester->execute([]);

        // Assert that the output contains the expected message
        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Roles added to the role table.', $output);
    }
}
