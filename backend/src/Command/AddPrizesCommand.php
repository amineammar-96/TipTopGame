<?php

namespace App\Command;

use App\Entity\Prize;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class AddPrizesCommand extends Command
{
    protected static $defaultName = 'app:add-prizes';

    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();

        $this->entityManager = $entityManager;
    }

    protected function configure()
    {
        $this->setDescription('Add prizes to the database');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $prizesData = [
            ['Infuser', 'Infuser', 'physical', 'Infuser', 60.0],
            ['Tea Box (100g)', 'Tea Box (100g)', 'physical', 'Tea Box (100g)', 20.0],
            ['Signature Tea Box (100g)', 'Signature Tea Box (100g)', 'physical', 'Tea Box (100g)', 10.0],
            ['Discovery Set (Value: 39€)', 'Discovery Set (Value: 39€)', 'physical', '39€', 6.0],
            ['Discovery Set (Value: 69€)', 'Discovery Set (Value: 69€)', 'physical', '69€', 4.0],
        ];

        foreach ($prizesData as $prizeData) {
            $prize = new Prize();
            $prize->setLabel($prizeData[0]);
            $prize->setName($prizeData[1]);
            $prize->setType($prizeData[2]);
            $prize->setPrizeValue($prizeData[3]);
            $prize->setWinningRate($prizeData[4]);

            $this->entityManager->persist($prize);
        }

        $this->entityManager->flush();

        $output->writeln('Prizes added to the database.');

        return Command::SUCCESS;
    }
}
