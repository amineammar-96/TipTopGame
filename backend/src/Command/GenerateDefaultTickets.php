<?php

namespace App\Command;

use App\Entity\Prize;
use App\Entity\Ticket;
use App\Repository\PrizeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Doctrine\DBAL\Connection;

class GenerateDefaultTickets extends Command
{
    protected static $defaultName = 'app:generate-tickets';

    private EntityManagerInterface $entityManager;
    private PrizeRepository $prizeRepository;

    private Connection $connection;

    public function __construct(EntityManagerInterface $entityManager, PrizeRepository $prizeRepository , Connection $connection)
    {
        parent::__construct();

        $this->entityManager = $entityManager;
        $this->prizeRepository = $prizeRepository;
        $this->connection = $connection;

    }

    protected function configure()
    {
        $this->setDescription('Generate 500,000 tickets with the winning rating of each prize');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->connection->executeQuery('SET SQL_SAFE_UPDATES = 0');
        $this->connection->executeQuery('SET FOREIGN_KEY_CHECKS=0');
        $this->connection->executeQuery('DELETE FROM ticket');
        $this->connection->executeQuery('ALTER TABLE ticket AUTO_INCREMENT = 1');
        $this->connection->executeQuery('SET FOREIGN_KEY_CHECKS=1');
        $this->connection->executeQuery('SET SQL_SAFE_UPDATES = 1');


        $prizes = $this->prizeRepository->findAll();

        $totalWinningRate = array_reduce($prizes, function ($sum, Prize $prize) {
            return $sum + $prize->getWinningRate();
        }, 0);

        $ticketCount = 20000;
        $tickets = [];
        $generatedTicketCodes = [];

        for ($i = 0; $i < $ticketCount; $i++) {
            do {$randomTicketCode = 'TK' . substr(uniqid(), -8);
                $uppercaseTicketCode = strtoupper($randomTicketCode);
            } while (in_array($randomTicketCode, $generatedTicketCodes));

            $generatedTicketCodes[] = $randomTicketCode;

            $randomNumber = mt_rand(1, $totalWinningRate);
            $winningPrize = null;

            foreach ($prizes as $prize) {
                $randomNumber -= $prize->getWinningRate();

                if ($randomNumber <= 0) {
                    $winningPrize = $prize;
                    break;
                }
            }

            if ($winningPrize) {
                $ticket = new Ticket();
                $ticket->setPrize($winningPrize);
                $ticket->setTicketCode(strtoupper($randomTicketCode));
                $ticket->setTicketGeneratedAt(new \DateTimeImmutable());
                $ticket->setTicketPrintedAt(null);
                $ticket->setWinDate(null);
                $ticket->setStatus(Ticket::STATUS_GENERATED);
                $this->entityManager->persist($ticket);
                $tickets[] = $ticket;
            }
        }

        // Persist the generated tickets in the database
        $this->entityManager->flush();

        $output->writeln('500,000 tickets generated with the winning rating of each prize.');
        return Command::SUCCESS;
    }
}
