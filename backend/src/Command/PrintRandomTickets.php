<?php

namespace App\Command;

use App\Entity\Prize;
use App\Entity\Role;
use App\Entity\Store;
use App\Entity\Ticket;
use App\Entity\User;
use App\Repository\PrizeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Doctrine\DBAL\Connection;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PrintRandomTickets extends Command
{
    protected static $defaultName = 'app:print-random-tickets';

    private EntityManagerInterface $entityManager;



    public function __construct(EntityManagerInterface $entityManager, PrizeRepository $prizeRepository )
    {
        parent::__construct();

        $this->entityManager = $entityManager;
        $this->prizeRepository = $prizeRepository;
    }

    protected function configure()
    {
        $this->setDescription('
           This command prints random tickets
        ');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $randomTickets = $this->getRandomTickets();
        $this->printRandomTickets($output , $randomTickets);


        $output->writeln('Tickets printed successfully.');
        return Command::SUCCESS;
    }

    private function getRandomTickets(): array
    {
        $ticketRepository = $this->entityManager->getRepository(Ticket::class);

        $totalTickets = $ticketRepository->createQueryBuilder('t')
            ->select('COUNT(t.id)')
            ->where('t.status = 1')
            ->getQuery()
            ->getSingleScalarResult();

        $offset = mt_rand(0, max(0, $totalTickets - 400));

        return $ticketRepository->createQueryBuilder('t')
            ->setFirstResult($offset)
            ->setMaxResults(400)
            ->getQuery()
            ->getResult();
    }

    //printRandomTickets
    private function printRandomTickets(OutputInterface $output , array $randomTickets): void
    {
        $userRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_EMPLOYEE]);
        $employees = $this->entityManager->getRepository(User::class)->findBy(['role' => $userRole]);

        $output->writeln('Printing random tickets...');

        foreach ($randomTickets as $ticket) {
            $employee = $employees[array_rand($employees)];
            $store = $employee->getStores()[0];

            $ticket->setStore($store);
            $ticket->setStatus(Ticket::STATUS_PRINTED);
            $ticket->setEmployee($employee);
            $ticket->setTicketPrintedAt(new \DateTimeImmutable());
            $ticket->setUpdatedAt(new \DateTimeImmutable());
            $ticket->setUser(null);

            $this->entityManager->persist($ticket);
        }

        $this->entityManager->flush();
    }


}
