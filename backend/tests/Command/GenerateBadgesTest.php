<?php

namespace App\Tests\Command;

use App\Command\GenerateBadges;
use App\Entity\Badge;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\DBAL\Connection;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

class GenerateBadgesTest extends TestCase
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
        // Mock the behavior of executeQuery method
        $this->connection->expects($this->any())
            ->method('executeQuery')
            ->willReturnCallback(function () {
                // Simulate SQL queries here if needed
            });

        // Expect persist to be called 5 times (for each badge)
        $this->entityManager->expects($this->exactly(5))
            ->method('persist')
            ->with($this->isInstanceOf(Badge::class));

        // Expect flush to be called once
        $this->entityManager->expects($this->once())
            ->method('flush');

        // Create the command
        $command = new GenerateBadges($this->entityManager, $this->connection);

        // Create the application and add the command
        $application = new Application();
        $application->add($command);

        // Find the command by its name
        $command = $application->find('app:generate-badges');

        // Create the command tester
        $commandTester = new CommandTester($command);

        // Execute the command
        $commandTester->execute([]);

        // Assert the output contains the expected message
        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Badges generated successfully !', $output);
    }
}
