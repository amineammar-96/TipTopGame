<?php
// src/Command/AddCompanyCommand.php

namespace App\Command;

use App\Entity\Role;
use App\Entity\Store;
use App\Entity\UserPersonalInfo;
use App\Entity\UserStore;
use App\Entity\User;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AddTipTopCompany extends Command
{
    protected static $defaultName = 'app:create-default-tiptop-company';

    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordEncoder;
    private Connection $connection;

    public function __construct(EntityManagerInterface $entityManager , UserPasswordHasherInterface $passwordEncoder , Connection $connection)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
        $this->connection = $connection;
    }

    protected function configure()
    {
        $this
            ->setDescription('Add the first store "Thé Tip Top" and the profile for the role ROLE_STOREMANAGER.')
            ->setHelp('This command allows you to add the first store and role profile.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {



        $store=$this->addCompany();
        $this->generateAnonymousProfile($this->entityManager , $output);
        $userManager=$this->addStoreManagerProfile();
        $this->addStoreManagerRelationShipWithAllStores($this->entityManager, $userManager, $store);

        $output->writeln('Company and manager profile added  to the role table. (relationship too)');

        return Command::SUCCESS;
    }

    private function addStoreManagerRelationShipWithAllStores(EntityManagerInterface $entityManager, User $userManager, Store $store): void
    {
        $storeRepository = $entityManager->getRepository(Store::class);
        $stores = $storeRepository->findAll();
        foreach ($stores as $store) {
            $userManager->addStore($store);
            $store->addUser($userManager);
            $this->entityManager->persist($userManager);
            $this->entityManager->persist($store);
        }
        $this->entityManager->flush();


    }

    private function addCompany():Store
    {
        $store = new Store();
        $store->setName('Thé Tip Top');
        $store->setAddress('18 rue Léon Frot');
        $store->setPostalCode('75011');
        $store->setCity('Paris');
        $store->setCountry('France');
        $store->setEmail('the.tiptop@contact.com');
        $store->setHeadquartersAddress('18 rue Léon Frot, 75011 Paris');
        $store->setPhone('+33 1 43 55 55 55');

        $store->setSiren('94354353435');


        $store->setCapital('150000.00');
        $store->setStatus(Store::STATUS_OPEN);
        $store->setOpeningDate(new \DateTime());

        $this->entityManager->persist($store);
        $this->entityManager->flush();
        return $store;
    }

    private function addStoreManagerProfile():User
    {
        $roleRepository = $this->entityManager->getRepository(Role::class);
        $storesAdminRole = $roleRepository->findOneBy(['name' => Role::ROLE_ADMIN]);
        $userManager = new User();
        $userManager->setLastname('Bourdon');
        $userManager->setFirstname('Eric');
        $userManager->setGender('Homme');
        $userManager->setEmail('eric.bourdon@gmail.com');
        $userManager->setRole($storesAdminRole);
        $userManager->setStatus(User::STATUS_OPEN);
        $userManager->setCreatedAt(new \DateTime());
        $userManager->setIsActive(true);
        $userManager->setActivitedAt(new \DateTime());
        $userManager->setDateOfBirth(new \DateTime('1980-01-06'));
        $plainPassword = 'azerty123456'; 
        $hashedPassword = $this->passwordEncoder->hashPassword($userManager, $plainPassword);
        $userManager->setPassword($hashedPassword);

        $userPersonalInfo = new UserPersonalInfo();
        $userPersonalInfo->setUser($userManager);
        $userPersonalInfo->setAddress('18 rue Léon Frot');
        $userPersonalInfo->setPostalCode('75011');
        $userPersonalInfo->setCity('Paris');
        $userPersonalInfo->setCountry('France');

        $this->entityManager->persist($userPersonalInfo);

        $this->entityManager->persist($userManager);
        $this->entityManager->flush();

        return $userManager;

    }

    private function generateAnonymousProfile(EntityManagerInterface $entityManager, OutputInterface $output): void
    {
        $roleRepository = $entityManager->getRepository(Role::class);
        $anonymousRole = $roleRepository->findOneBy(['name' => Role::ROLE_ANONYMOUS]);
        $anonymousUser = new User();
        $anonymousUser->setLastname('Anonymous');
        $anonymousUser->setFirstname('Anonymous');
        $anonymousUser->setGender('Homme');
        $anonymousUser->setEmail('anonymous@anonymous.fr');
        $anonymousUser->setRole($anonymousRole);

        $anonymousUser->setStatus(User::STATUS_OPEN);
        $anonymousUser->setCreatedAt(new \DateTime());
        $anonymousUser->setIsActive(true);
        $anonymousUser->setActivitedAt(new \DateTime());

        $anonymousUser->setDateOfBirth(new \DateTime('1980-01-06'));

        $plainedPassword = 'anonymous';
        $hashedPassword = $this->passwordEncoder->hashPassword($anonymousUser, $plainedPassword);
        $anonymousUser->setPassword($hashedPassword);


        $userPersonalInfo = new UserPersonalInfo();
        $userPersonalInfo->setUser($anonymousUser);
        $userPersonalInfo->setAddress('18 rue Léon Frot');
        $userPersonalInfo->setPostalCode('75011');
        $userPersonalInfo->setCity('Paris');
        $userPersonalInfo->setCountry('France');

        $entityManager->persist($userPersonalInfo);

        $entityManager->persist($anonymousUser);
        $entityManager->flush();
        $output->writeln('Anonymous profile added to the role table.');

    }
}
