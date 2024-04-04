<?php

namespace App\Tests\Command;

use App\Command\AddTipTopCompany;
use App\Entity\Role;
use App\Entity\Store;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\DBAL\Connection;
use Symfony\Component\Console\Output\OutputInterface;

class AddTipTopCompanyTest extends TestCase
{
    private $entityManager;
    private $passwordEncoder;
    private $connection;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->passwordEncoder = $this->createMock(UserPasswordHasherInterface::class);
        $this->connection = $this->createMock(Connection::class);
    }

    public function testExecute(): void
    {
        $roleRepository = $this->createMock(EntityRepository::class);
        $storeRepository = $this->createMock(EntityRepository::class);

        $this->entityManager->expects($this->exactly(4))
        ->method('getRepository')
            ->withConsecutive([Role::class], [Role::class], [Role::class], [Store::class])
            ->willReturnOnConsecutiveCalls($roleRepository, $roleRepository, $roleRepository, $storeRepository);

        $roleRepository->expects($this->any())
            ->method('findOneBy')
            ->willReturn(new Role());

        $storeRepository->expects($this->any())
            ->method('findOneBy')
            ->willReturn(new Store());

        $command = new AddTipTopCompany($this->entityManager, $this->passwordEncoder, $this->connection);

        $application = new Application();
        $application->add($command);

        $command = $application->find('app:create-default-tiptop-company');

        $commandTester = new CommandTester($command);

        $commandTester->execute([]);

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Default company and profiles added  to the role table.', trim($output));
    }

}
