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

class GenerateFakeData extends Command
{
    protected static $defaultName = 'app:generate-data';

    private EntityManagerInterface $entityManager;
    private PrizeRepository $prizeRepository;

    private Connection $connection;

    private UserPasswordHasherInterface $passwordEncoder;


    public function __construct(EntityManagerInterface $entityManager, PrizeRepository $prizeRepository , Connection $connection , UserPasswordHasherInterface $passwordEncoder)
    {
        parent::__construct();

        $this->entityManager = $entityManager;
        $this->prizeRepository = $prizeRepository;
        $this->connection = $connection;
        $this->passwordEncoder = $passwordEncoder;

    }

    protected function configure()
    {
        $this->setDescription('Generate fake data for stores, tickets, user, (managers , employee,client) table.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $randomTickets = $this->getRandomTickets();
        $this->generateFakeStores($output);
        $this->generateFakeManager($output);
        $this->generateFakeEmployee($output);
        $this->generateFakeClient($output);
        $this->generateFakeGain($output , $randomTickets);



        $output->writeln('Fake data generated.');
        return Command::SUCCESS;
    }


    /**
     * @throws NonUniqueResultException
     * @throws NoResultException
     */
    private function getRandomTickets(): array
    {
        $ticketRepository = $this->entityManager->getRepository(Ticket::class);

        $totalTickets = $ticketRepository->createQueryBuilder('t')
            ->select('COUNT(t.id)')
            ->where('t.status = 1')
            ->getQuery()
            ->getSingleScalarResult();

        $offset = mt_rand(0, max(0, $totalTickets - 100));

        return $ticketRepository->createQueryBuilder('t')
            ->setFirstResult($offset)
            ->setMaxResults(100)
            ->getQuery()
            ->getResult();
    }

    private function generateFakeStores($output)
    {
        $faker = Factory::create();
        $storeCount = 20;

        for ($i = 0; $i < $storeCount; $i++) {
            $store = new Store();
            $store->setName($faker->company);
            $store->setAddress($faker->streetAddress);
            $store->setHeadquartersAddress($faker->address);
            $store->setEmail($faker->email);
            $store->setPostalCode($faker->postcode);
            $store->setCity($faker->city);
            $store->setCountry($faker->country);
            $store->setCapital($faker->randomFloat(2, 1000, 1000000));
            $store->setStatus($faker->randomElement([1, 2]));
            $store->setOpeningDate($faker->dateTimeThisDecade);
            $store->setPhone($faker->phoneNumber);
            $store->setSiren($faker->randomNumber(9, true));
            $this->entityManager->persist($store);
        }

        $output->writeln('10 stores added to the store table.');
        $this->entityManager->flush();
    }

    private function generateFakeManager($output): int
    {
        $storeManagerRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_STOREMANAGER]);
        if (!$storeManagerRole) {
            $output->writeln('Error: ROLE_STOREMANAGER role not found.');
            return Command::FAILURE;
        }
        $allStores = $this->entityManager->getRepository(Store::class)->findAll();

        if (empty($allStores)) {
            $output->writeln('Error: No stores found in the database.');
            return Command::FAILURE;
        }

        for ($i = 0; $i < 20; $i++) {
            $store = $allStores[array_rand($allStores)];
            $user = new User();
            $user->setEmail(Factory::create()->email);
            $user->setFirstname(Factory::create()->firstName);
            $user->setLastname(Factory::create()->lastName);
            $user->setGender(Factory::create()->randomElement(['Homme', 'Femme']));
            $user->setDateOfBirth(Factory::create()->dateTimeThisCentury);
            $user->setStatus(User::STATUS_OPEN);
            $plainPassword="azerty";
            $hashedPassword = $this->passwordEncoder->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
            $user->setRole($storeManagerRole);
            $user->addStore($store);
            $store->addUser($user);
            $this->entityManager->persist($store);
            $this->entityManager->persist($user);
        }

        $this->entityManager->flush();

        $output->writeln('20 managers added to the user table. (relationship too)');
        return Command::SUCCESS;
    }

    private function generateFakeEmployee(OutputInterface $output)
    {
        $employeeRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_EMPLOYEE]);
        if (!$employeeRole) {
            $output->writeln('Error: ROLE_EMPLOYEE role not found.');
            return Command::FAILURE;
        }

        $allStores = $this->entityManager->getRepository(Store::class)->findAll();

        if (empty($allStores)) {
            $output->writeln('Error: No stores found in the database.');
            return Command::FAILURE;
        }

        for ($i = 0; $i < 20; $i++) {
            $store = $allStores[array_rand($allStores)];
            $user = new User();
            $user->setEmail(Factory::create()->email);
            $user->setFirstname(Factory::create()->firstName);
            $user->setLastname(Factory::create()->lastName);
            $user->setGender(Factory::create()->randomElement(['Homme', 'Femme']));
            $user->setDateOfBirth(Factory::create()->dateTimeThisCentury);
            $plainPassword="azerty";
            $hashedPassword = $this->passwordEncoder->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
            $user->setRole($employeeRole);
            $user->addStore($store);
            $store->addUser($user);
            $user->setStatus(User::STATUS_OPEN);

            $this->entityManager->persist($store);
            $this->entityManager->persist($user);
        }
        $this->entityManager->flush();

        $output->writeln('20 employees added to the user table. (relationship too)');
        return Command::SUCCESS;
    }

    private function generateFakeClient(OutputInterface $output)
    {
        $clientRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_CLIENT]);
        if (!$clientRole) {
            $output->writeln('Error: ROLE_CLIENT role not found.');
            return Command::FAILURE;
        }

        $allStores = $this->entityManager->getRepository(Store::class)->findAll();

        if (empty($allStores)) {
            $output->writeln('Error: No stores found in the database.');
            return Command::FAILURE;
        }

        for ($i = 0; $i < 20; $i++) {
            $store = $allStores[array_rand($allStores)];
            $user = new User();
            $user->setEmail(Factory::create()->email);
            $user->setFirstname(Factory::create()->firstName);
            $user->setLastname(Factory::create()->lastName);
            $user->setGender(Factory::create()->randomElement(['Homme', 'Femme']));
            $user->setDateOfBirth(Factory::create()->dateTimeThisCentury);
            $user->setStatus(User::STATUS_OPEN);
            $plainPassword="azerty";
            $hashedPassword = $this->passwordEncoder->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
            $user->setRole($clientRole);
            $user->addStore($store);
            $store->addUser($user);
            $this->entityManager->persist($store);
            $this->entityManager->persist($user);
        }
        $this->entityManager->flush();

        $output->writeln('20 clients added to the user table. (relationship too)');
        return Command::SUCCESS;
    }

    private function generateFakeGain(OutputInterface $output, array $randomTickets)
    {
        $clientRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_CLIENT]);
        $employeeRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_EMPLOYEE]);

        if (!$clientRole || !$employeeRole) {
            $output->writeln('Error: CLIENT or EMPLOYEE role not found.');
            return Command::FAILURE;
        }

        $clients = $this->getRandomUsersByRole($clientRole, 10);

        $employees = $this->getRandomUsersByRole($employeeRole, 10);

        foreach ($randomTickets as $ticket) {
            $client = $clients[array_rand($clients)];
            $client->addTicket($ticket);
            $employee = $employees[array_rand($employees)];
            $ticket->setStatus(Ticket::STATUS_PRINTED);
            $ticket->setTicketPrintedAt(new \DateTimeImmutable());
            $ticket->setWinDate(new \DateTimeImmutable());
            $ticket->setTicketGeneratedAt(new \DateTimeImmutable());
            $ticket->setUpdatedAt(new \DateTimeImmutable());
            $ticket->setEmployee($employee);
            $ticket->setStore($employee->getStores()[0]);
            $employee->addTicket($ticket);
            $ticket->setUser($client);
            $this->entityManager->persist($ticket);
            $this->entityManager->persist($client);
            $this->entityManager->persist($employee);
        }

        foreach ($randomTickets as $ticket) {
            $ticket->setStatus(Ticket::STATUS_WINNER);
            $ticket->setTicketPrintedAt(new \DateTimeImmutable());
            $ticket->setWinDate(new \DateTimeImmutable());
            $ticket->setTicketGeneratedAt(new \DateTimeImmutable());
            $ticket->setUpdatedAt(new \DateTimeImmutable());
            $this->entityManager->persist($ticket);
        }

        $this->entityManager->flush();

        $output->writeln('Fake gains generated and linked to clients and employees.');
        return Command::SUCCESS;
    }

    private function getRandomUsersByRole(Role $role, int $count): array
    {
        $users = $this->entityManager->getRepository(User::class)->findBy(['role' => $role]);

        if (count($users) < $count) {
            return [];
        }

        shuffle($users);
        return array_slice($users, 0, $count);
    }
}
