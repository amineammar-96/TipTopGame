<?php

namespace App\Command;

use App\Entity\GameConfig;
use App\Entity\Prize;
use App\Entity\Role;
use App\Entity\Store;
use App\Entity\Ticket;
use App\Entity\TicketHistory;
use App\Entity\User;
use App\Entity\UserPersonalInfo;
use App\Repository\PrizeRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Exception;
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

    /**
     * @throws NonUniqueResultException
     * @throws NoResultException
     * @throws Exception
     */
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

        $offset = mt_rand(0, max(0, $totalTickets - 3000));

        return $ticketRepository->createQueryBuilder('t')
            ->setFirstResult($offset)
            ->setMaxResults(1200)
            ->getQuery()
            ->getResult();
    }

    private function generateFakeStores($output)
    {
        $faker = Factory::create();
        $storeCount = 5;

        $cities = ["Paris" , "Lyon" , "Marseille" , "Madrid" , "Bordeaux"];


        for ($i = 0; $i < $storeCount; $i++) {
            $store = new Store();
            $store->setName($faker->company);
            $store->setAddress($faker->streetAddress);
            $store->setHeadquartersAddress($faker->address);
            $store->setEmail($faker->email);
            $store->setPostalCode($faker->postcode);
            $store->setCity($cities[array_rand($cities)]);
            $store->setCountry($faker->country);
            $store->setCapital($faker->randomFloat(2, 1000, 1000000));
            $store->setStatus($faker->randomElement([1, 2]));
            $store->setOpeningDate($faker->dateTimeThisDecade);
            $store->setPhone($faker->phoneNumber);
            $store->setSiren($faker->randomNumber(9, true));
            $this->entityManager->persist($store);
        }

        $output->writeln('5 stores added to the store table.');
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
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < 5; $i++) {
            $store = $allStores[array_rand($allStores)];
            $user = new User();

            $user->setEmail($faker->email);
            $user->setFirstname($faker->firstName);
            $user->setLastname($faker->lastName);
            $user->setGender($faker->randomElement(['Homme', 'Femme']));
            $dob = $faker->dateTimeBetween('-100 years', '-18 years');
            $user->setDateOfBirth($dob);
            $user->setStatus(User::STATUS_OPEN);

            $user->setCreatedAt(new DateTime());
            $user->setIsActive($faker->boolean(70));
            $user->setActivitedAt(new DateTime());

            $user->setPhone($faker->phoneNumber);
            $plainPassword = "azerty";
            $hashedPassword = $this->passwordEncoder->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
            $user->setRole($storeManagerRole);
            $user->addStore($store);
            $store->addUser($user);

            $this->entityManager->persist($store);
            $this->entityManager->persist($user);

            $userPersonalInfo = new UserPersonalInfo();
            $userPersonalInfo->setUser($user);
            $userPersonalInfo->setAddress($faker->streetAddress);
            $userPersonalInfo->setPostalCode($faker->postcode);
            $userPersonalInfo->setCity($faker->city);
            $userPersonalInfo->setCountry($faker->country);

            $this->entityManager->persist($userPersonalInfo);

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

        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < 20; $i++) {
            $store = $allStores[array_rand($allStores)];
            $user = new User();
            $user->setEmail($faker->email);
            $user->setFirstname($faker->firstName);
            $user->setLastname($faker->lastName);
            $user->setGender($faker->randomElement(['Homme', 'Femme']));
            $dob = $faker->dateTimeBetween('-100 years', '-16 years');
            $user->setDateOfBirth($dob);
            $user->setPhone($faker->phoneNumber);
            $plainPassword = "azerty";
            $hashedPassword = $this->passwordEncoder->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
            $user->setRole($employeeRole);
            $user->addStore($store);
            $store->addUser($user);
            $user->setStatus(User::STATUS_OPEN);
            $user->setCreatedAt(new DateTime());
            $user->setIsActive($faker->boolean(70));
            $user->setActivitedAt(new DateTime());

            $userPersonalInfo = new UserPersonalInfo();
            $userPersonalInfo->setUser($user);
            $userPersonalInfo->setAddress($faker->streetAddress);
            $userPersonalInfo->setPostalCode($faker->postcode);
            $userPersonalInfo->setCity($faker->city);
            $userPersonalInfo->setCountry('France');

            $this->entityManager->persist($store);
            $this->entityManager->persist($user);
            $this->entityManager->persist($userPersonalInfo);
        }
        $this->entityManager->flush();

        $output->writeln('40 employees added to the user table. (relationship too)');
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

        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < 50; $i++) {
            $store = $allStores[array_rand($allStores)];
            $user = new User();
            $user->setEmail($faker->email);
            $user->setFirstname($faker->firstName);
            $user->setLastname($faker->lastName);
            $user->setGender($faker->randomElement(['Homme', 'Femme']));

            $dob = $faker->dateTimeBetween('-100 years', '-16 years');
            $user->setDateOfBirth($dob);

            $user->setStatus(User::STATUS_OPEN);
            $user->setPhone($faker->phoneNumber);
            $plainPassword = "azerty";
            $hashedPassword = $this->passwordEncoder->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
            $user->setRole($clientRole);
            $user->addStore($store);
            $store->addUser($user);
            $this->entityManager->persist($store);
            $this->entityManager->persist($user);

            $user->setCreatedAt(new DateTime());
            $user->setIsActive($faker->boolean(70));
            $user->setActivitedAt(new DateTime());
            $userPersonalInfo = new UserPersonalInfo();
            $userPersonalInfo->setUser($user);
            $userPersonalInfo->setAddress($faker->streetAddress);
            $userPersonalInfo->setPostalCode($faker->postcode);
            $userPersonalInfo->setCity($faker->city);
            $userPersonalInfo->setCountry('France');

            $this->entityManager->persist($userPersonalInfo);
        }
        $this->entityManager->flush();

        $output->writeln('100 clients added to the user table. (relationship too)');
        return Command::SUCCESS;
    }

    /**
     * @throws Exception
     */
    private function generateFakeGain(OutputInterface $output, array $randomTickets): void
    {
        $clientRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_CLIENT]);
        $employeeRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_EMPLOYEE]);
        $gameConfig = $this->entityManager->getRepository(GameConfig::class)->find(1);
        $gameConfigStartDate = null;
        $dateFormat = 'd/m/Y H:i';
        if ($gameConfig) {
            $gameConfigStartDate = DateTime::createFromFormat($dateFormat, $gameConfig->getStartDate() . " " . $gameConfig->getTime());
        }

        if (!$clientRole || !$employeeRole) {
            $output->writeln('Error: CLIENT or EMPLOYEE role not found.');
            return;
        }

        $clients = $this->getRandomUsersByRole($clientRole, 20);
        $anonymousRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name' => Role::ROLE_ANONYMOUS]);
        $anonymousUser = $this->entityManager->getRepository(User::class)->findOneBy(['role' => $anonymousRole]);

        $employees = $this->getRandomUsersByRole($employeeRole, 20);

        $statuses = [Ticket::STATUS_PRINTED, Ticket::STATUS_PENDING_VERIFICATION, Ticket::STATUS_WINNER];

        foreach ($randomTickets as $ticket) {
            $randomDate = clone $gameConfigStartDate;
            $client = $clients[array_rand($clients)];
            $employee = $employees[array_rand($employees)];


            foreach ($statuses as $randomStatus) {
                $this->updateTicket($ticket, $client, $employee, $anonymousUser, $randomStatus , $randomDate);

                if ($randomStatus === Ticket::STATUS_PRINTED) {
                    //$client = $anonymousUser;
                }
                $this->createTicketHistory($ticket, $randomDate, $randomStatus, $employee, $client);
                $randomDate->modify('+1 day');
            }
        }

        $this->entityManager->flush();

        $output->writeln('Fake gains generated and linked to clients and employees.');
    }

    private function createTicketHistory(Ticket $ticket, DateTime $randomDate, string $randomStatus, User $employee, User $client ): void
    {
        $ticketHistory = new TicketHistory();
        $ticketHistory->setTicket($ticket);
        $ticketHistory->setUser($client);
        $ticketHistory->setEmployee($employee);
        $ticketHistory->setStatus($randomStatus);
        $ticketHistory->setUpdatedAt($randomDate);

        $this->entityManager->persist($ticketHistory);
    }

    private function updateTicket(Ticket $ticket, User $client, User $employee, User $anonymousUser, int $randomStatus,  DateTime $randomDate): void
    {

        $ticket->setStatus($randomStatus);

        if ($randomStatus === Ticket::STATUS_WINNER) {
            $ticket->setWinDate($randomDate);
        }

        if ($randomStatus === Ticket::STATUS_PRINTED) {
            $ticket->setTicketPrintedAt($randomDate);
        }

        $ticket->setUpdatedAt($randomDate);
        $ticket->setEmployee($employee);
        $ticket->setUser($client);
        $ticket->setStore($employee->getStores()[0]);

        $employee->addTicket($ticket);
        $client->addTicket($ticket);
        $client->addStore($employee->getStores()[0]);
        $store = $employee->getStores()[0];


        $store->addUser($client);

        $this->entityManager->persist($store);
        $this->entityManager->persist($ticket);
        $this->entityManager->persist($client);
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
