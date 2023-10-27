<?php

// src/Command/CreateDefaultRoles.php
namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Role;

class CreateDefaultRoles extends Command
{
    protected static $defaultName = 'app:create-default-roles';

    protected static $defaultDescription = 'Fills the role table with predefined roles';

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();

        $this->entityManager = $entityManager;
    }

    protected function configure()
    {
        // Add any arguments or options if needed
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $roles = [
            ['name' => 'ROLE_ADMIN', 'label' => 'Administrateur'],
            ['name' => 'ROLE_STOREMANAGER', 'label' => 'Gestionnaire de Magasin'],
            ['name' => 'ROLE_EMPLOYEE', 'label' => 'Employé'],
            ['name' => 'ROLE_BAILIFF', 'label' => 'Huissier'],
            ['name' => 'ROLE_CLIENT', 'label' => 'Client'],

        ];

        foreach ($roles as $roleData) {
            $role = new Role();
            $role->setName($roleData['name']);
            $role->setLabel($roleData['label']);

            $this->entityManager->persist($role);
        }

        $this->entityManager->flush();

        $output->writeln('Roles added to the role table.');

        return Command::SUCCESS;
    }
}
