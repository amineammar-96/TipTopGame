<?php

namespace App\Command;

use App\Entity\GameConfig;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class initializeGameConfigCommand extends Command
{
    protected static $defaultName = 'app:game-config-init';

    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
    }

    protected function configure()
    {
        $this->setDescription('Initialize game configuration Date');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $existingGameConfig = $this->entityManager->getRepository(GameConfig::class)->find(1);


        if(empty($existingGameConfig)){
            $gameConfig = new GameConfig();

            $randomFutureDate = new \DateTime();
            $randomFutureDate->modify('+'.rand(0, 5).' days');
            $dateFormatted = $randomFutureDate->format('d/m/Y');
            $gameConfig->setStartDate($dateFormatted);
            $gameConfig->setTime("09:00");
            $this->entityManager->persist($gameConfig);
            $this->entityManager->flush();
            $output->writeln('Game configuration initialized successfully !');
         }else{
            $output->writeln('Game configuration already initialized !!!!');
         }


        return Command::SUCCESS;
    }

   

   


}
