<?php
// src/Command/ResetGame.php

namespace App\Command;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Doctrine\DBAL\Connection;
use Symfony\Component\Process\Process;

class ResetGame extends Command
{
    protected static $defaultName = 'app:reset-game';

    private EntityManagerInterface $entityManager;

    private Connection $connection;


    public function __construct(EntityManagerInterface $entityManager , Connection $connection )
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->connection = $connection;

    }

    protected function configure()
    {
        $this->setDescription('Generate badges for clients');

    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {

        $tables=['ticket_history','user_badge','store_user' ,'user_store','user_personal_info','user','store',
            'loyalty_points' ,'connection_history' , 'emailing_history' , 'action_history' ,'avatar' ];
        $this->purgeTables($tables);




        $process = new Process(['php', 'bin/console', 'app:create-default-role']);
        $process->mustRun();
        $output->writeln('Default roles created successfully.');

        $process = new Process(['php', 'bin/console', 'app:create-default-tiptop-company']);
        $process->mustRun();
        $output->writeln('Default company created successfully.');

        $process = new Process(['php', 'bin/console', 'app:add-prizes']);
        $process->mustRun();
        $output->writeln('Prizes created successfully.');

        $process = new Process(['php', 'bin/console', 'app:generate-badges']);
        $process->mustRun();
        $output->writeln('Badges generated successfully.');

        $process = new Process(['php', 'bin/console', 'app:generate-tickets']);
        $process->setTimeout(null);
        $process->mustRun();
        $output->writeln('Tickets generated successfully.');

        $process = new Process(['php', 'bin/console', 'app:generate-email-services']);
        $process->mustRun();
        $output->writeln('Email Services generated successfully.');

        $process = new Process(['php', 'bin/console', 'app:generate-email-templates-variables']);
        $process->mustRun();
        $output->writeln('Email Templates Variables generated successfully.');

        $process = new Process(['php', 'bin/console', 'app:generate-email-templates']);
        $process->mustRun();
        $output->writeln('Email Templates generated successfully.');

        $process = new Process(['php', 'bin/console', 'app:generate-data']);
        $process->setTimeout(null);
        $process->mustRun();
        $output->writeln('Data generated successfully.');

        $output->writeln('Game reset successfully.');

        return Command::SUCCESS;
    }

    private function purgeTables(array $tables): void
    {
        $this->connection->executeQuery('SET SQL_SAFE_UPDATES = 0');
        $this->connection->executeQuery('SET FOREIGN_KEY_CHECKS=0');
        foreach ($tables as $table) {
            $this->connection->executeQuery('DELETE FROM '.$table);
            $this->connection->executeQuery('ALTER TABLE '.$table.' AUTO_INCREMENT = 1');
        }
        $this->connection->executeQuery('SET FOREIGN_KEY_CHECKS=1');
        $this->connection->executeQuery('SET SQL_SAFE_UPDATES = 1');

    }

}
