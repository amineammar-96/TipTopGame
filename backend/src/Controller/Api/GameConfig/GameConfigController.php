<?php

namespace App\Controller\Api\GameConfig;


use App\Entity\GameConfig;

use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;


class GameConfigController extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;


    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;

    }


    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function getGameConfig(Request $request): JsonResponse
    {
        $principalPeriod = 30;
        $validationPeriod = 60;


        $gameConfig = $this->entityManager->getRepository(GameConfig::class)->find(1);
        $gameStatus = "";
        $timeRemainingToStart = [
            'days' => 0,
            'hours' => 0,
            'minutes' => 0,
            'seconds' => 0
        ];
        if ($gameConfig) {
            $startDate = $gameConfig->getStartDate() . " " . $gameConfig->getTime();
            $timeFormat = "d/m/Y H:i";
            $startDate = DateTime::createFromFormat($timeFormat, $startDate);
            $now = new DateTime();
            $interval = $startDate->diff($now);
            $timeRemainingToStart = [
                'days' => $interval->format('%a'),
                'hours' => $interval->format('%h'),
                'minutes' => $interval->format('%i'),
                'seconds' => $interval->format('%s')
            ];

            $principalPeriodFinishAt=null;
            $validationPeriodFinishAt=null;
            $startDateClone = clone $startDate;
            $principalPeriodFinishAt = $startDateClone->modify('+'.$principalPeriod.' days');

            $startDateClone = clone $startDate;
            $validationPeriodFinishAt = $startDateClone->modify('+'.$validationPeriod.' days');


            if($now < $startDate){
                $gameStatus = "A venir";
            }else if($now > $startDate && $now < $principalPeriodFinishAt){
                $gameStatus = "En cours";
            }else if($now > $principalPeriodFinishAt && $now < $validationPeriodFinishAt){
                $gameStatus = "Validation";
            }else if($now > $validationPeriodFinishAt){
                $gameStatus = "Terminé";
            }

        }


        return new JsonResponse([
            'gameConfig' => $gameConfig ? $gameConfig->getStartDate() : null,
            'principalPeriodFinishAt' => $this->getDateTimeAsJson($principalPeriodFinishAt),
            'validationPeriodFinishAt' => $this->getDateTimeAsJson($validationPeriodFinishAt),
            'timeRemainingToStart' => $timeRemainingToStart,
            'gameStatus' => $gameStatus,
            'time' => $gameConfig ? $gameConfig->getTime() : '00:00'
        ]);


    }

    /**
     * @isGranted("ROLE_ADMIN")
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function updateGameConfig(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $originalDate = new DateTime($data['startDate']);
        $formattedDate = $originalDate->format('d/m/Y');

        $gameConfig = $this->entityManager->getRepository(GameConfig::class)->find(1);
        if ($gameConfig) {
            $gameConfig->setStartDate($formattedDate);
            $gameConfig->setTime($data['time']);
            $this->entityManager->persist($gameConfig);
            $this->entityManager->flush();
        } else {
            $gameConfig = new GameConfig();
            $gameConfig->setStartDate($formattedDate);
            $gameConfig->setTime($data['time']);
            $this->entityManager->persist($gameConfig);
            $this->entityManager->flush();
        }

        return new JsonResponse([
            'gameConfig' => $gameConfig->getStartDate()
        ]);
    }

    private function getDateTimeAsJson(DateTime|bool $principalPeriodFinishAt)
    {
        return [
            'date' => $principalPeriodFinishAt ? $principalPeriodFinishAt->format('d/m/Y') : '00/00/0000',
            'time' => $principalPeriodFinishAt ? $principalPeriodFinishAt->format('H:i') : '00:00'
        ];
    }


}
