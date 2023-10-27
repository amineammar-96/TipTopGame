<?php

namespace App\Command;

use App\Entity\Prize;
use App\Entity\Ticket;
use App\Repository\PrizeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GenerateDefaultTickets extends Command
{
    protected static $defaultName = 'app:generate-tickets';

    private EntityManagerInterface $entityManager;
    private PrizeRepository $prizeRepository;

    public function __construct(EntityManagerInterface $entityManager, PrizeRepository $prizeRepository)
    {
        parent::__construct();

        $this->entityManager = $entityManager;
        $this->prizeRepository = $prizeRepository;
    }

    protected function configure()
    {
        $this->setDescription('Generate 500,000 tickets with the winning rating of each prize');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Fetch all prizes from the database
        $prizes = $this->prizeRepository->findAll();

        // Calculate the total winning rate from all prizes
        $totalWinningRate = array_reduce($prizes, function ($sum, Prize $prize) {
            return $sum + $prize->getWinningRate();
        }, 0);

        // Define the total number of tickets to generate
        $ticketCount = 50;
        $tickets = [];
        $generatedTicketCodes = [];

        // Generate tickets based on winning rate
        for ($i = 0; $i < $ticketCount; $i++) {
            // Generate a random ticket code in the format "TK******"
            do {
                $randomTicketCode = 'TK' . substr(uniqid(), -8);
            } while (in_array($randomTicketCode, $generatedTicketCodes));

            $generatedTicketCodes[] = $randomTicketCode;

            // Generate a random number between 1 and the total winning rate
            $randomNumber = mt_rand(1, $totalWinningRate);
            $winningPrize = null;

            // Iterate through each prize to find the winning prize
            foreach ($prizes as $prize) {
                // Subtract the winning rate of the current prize from the random number
                $randomNumber -= $prize->getWinningRate();

                // If the random number becomes non-positive or zero, the current prize is the winning prize
                if ($randomNumber <= 0) {
                    $winningPrize = $prize;
                    break;
                }
            }

            // Create a new ticket and associate it with the winning prize
            if ($winningPrize) {
                $ticket = new Ticket();
                $ticket->setPrize($winningPrize);
                $ticket->setTicketCode($randomTicketCode);
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
