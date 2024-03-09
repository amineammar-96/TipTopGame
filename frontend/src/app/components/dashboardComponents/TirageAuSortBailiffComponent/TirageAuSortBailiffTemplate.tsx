import React, {useEffect, useState} from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import {Col, Divider, Row, Tag} from "antd";
import {getGameConfig} from "@/app/api";
import LogoutService from "@/app/service/LogoutService";
import participantsTable
    from "@/app/components/dashboardComponents/ClientManagementComponents/components/ParticipantsTable";


interface DataType {
    startDate: string;
    time: string;
}

interface TimeRemaining {
    days: number,
    hours: number,
    minutes: number,
    seconds: number
}

function TirageAuSortBailiffTemplate() {
    const [gameStatus, setGameStatus] = useState<string>("");

    const {logoutAndRedirectAdminsUserToLoginPage} = LogoutService();

    const [loading, setLoading] = useState(false);

    const [gameConfig, setGameConfig] = useState<DataType>({
        startDate: "",
        time: ""
    });


    const [principalPeriodFinishAt, setPrincipalPeriodFinishAt] = useState<DataType>({
        startDate: "",
        time: ""
    });


    const [validationPeriodFinishAt, setValidationPeriodFinishAt] = useState<DataType>({
        startDate: "",
        time: ""
    });




    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });


    const [gameConfigOriginal, setGameConfigOriginal] = useState<DataType>({
        startDate: "",
        time: ""
    });

    const [participantsCount , setParticipantsCount] = useState<number>(0);
    function fetchGameConfig() {
        setLoading(true);
        getGameConfig().then((response) => {
            if (response) {
                setGameConfigOriginal({
                    startDate: response.gameConfig,
                    time: response.time
                })

                setPrincipalPeriodFinishAt({
                    startDate: response.principalPeriodFinishAt.date,
                    time: response.principalPeriodFinishAt.time
                });

                setValidationPeriodFinishAt({
                    startDate: response.validationPeriodFinishAt.date,
                    time: response.validationPeriodFinishAt.time
                });

                setGameStatus(response.gameStatus);

                const originalDate = response.gameConfig;
                const [day, month, year] = originalDate.split('/');


                const formatedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;



                setGameConfig({
                    startDate: formatedDate,
                    time: response.time
                });

                const timeRemainingToStart = response.timeRemainingToStart;
                setTimeRemaining({
                    days: timeRemainingToStart.days,
                    hours: timeRemainingToStart.hours,
                    minutes: timeRemainingToStart.minutes,
                    seconds: timeRemainingToStart.seconds
                });

                setParticipantsCount(response.participantsCount);

            }
        }).catch((err) => {
            if (err.response) {
                if (err.response.status === 401) {
                    logoutAndRedirectAdminsUserToLoginPage();
                }
            } else {
                console.log(err.request);
            }
        })
        setLoading(false);
    }

    useEffect(() => {
        fetchGameConfig();
    }, []);

    const statusColors: Record<string, string> = {
        "A venir": "processing",
        "En cours": "success",
        "Terminé": "error",
    };


    const [classColorTag , setClassColorTag] = useState<string>("");
    useEffect(() => {
        setClassColorTag(statusColors[gameStatus] as any);
    }, [gameStatus]);



    return (
        <div className={styles.homePageContent}>

            <div className={`${styles.homePageContentTopHeader}`}>
                <h1 className={`mx-3`}>
                    Tirage au sort final
                </h1>
                <div className={`${styles.ticketsCardsMain} mt-5`}>
                    <div className={`${styles.ticketsCardsDiv} ${styles.correspandancesDiv} mb-5 px-4`}>
                        <div className={` w-100 ${styles.templatesPersoDiv}`}>


                            {gameStatus === "Terminé" && (
                                <>
                                    <h5 className={"mt-5"}>
                                        Veuillez procéder au tirage au sort final
                                    </h5>

                                    <ul>
                                        <li>
                                    <span>
                                        Nombre de clients participants : {participantsCount}
                                    </span>
                                        </li>

                                    </ul>

                                    <Divider/>
                                </>
                            )}

                            <h5 className={"mt-5"}>

                                {gameStatus === "A venir" && (
                                    <>
                                        Début du jeu 🚀
                                    </>
                                )}

                                {gameStatus === "En cours" && (
                                    <>
                                    Date du jeu 🏁
                                    </>
                                )}

                                {gameStatus === "Validation" && (
                                    <>
                                        Date de la période de validation 🕣
                                    </>
                                )}

                                {gameStatus === "Terminé" && (
                                    <>
                                        Date de fin du jeu 🏁
                                    </>
                                )}


                                <Tag color={classColorTag} className="ms-3">{gameStatus}</Tag>
                                <br/>
                                {gameStatus === "En cours" && (
                                    <>
                                        <small>
                                            Du {gameConfigOriginal.startDate} à {gameConfigOriginal.time} jusqu'au {principalPeriodFinishAt.startDate} à {principalPeriodFinishAt.time}
                                        </small>
                                    </>
                                )}

                                {gameStatus === "A venir" && (
                                    <>
                                        <small>
                                            Du {gameConfigOriginal.startDate} à {gameConfigOriginal.time} jusqu'au {principalPeriodFinishAt.startDate} à {principalPeriodFinishAt.time}
                                        </small>
                                    </>
                                )}

                                {gameStatus === "Validation" && (
                                    <>
                                        <small>
                                            Du {principalPeriodFinishAt.startDate} à {principalPeriodFinishAt.time} jusqu'au {validationPeriodFinishAt.startDate} à {validationPeriodFinishAt.time}
                                        </small>
                                    </>
                                )}

                                {gameStatus === "Terminé" && (
                                    <>
                                        <small>
                                            Du {gameConfigOriginal.startDate} à {gameConfigOriginal.time} jusqu'au {principalPeriodFinishAt.startDate} à {principalPeriodFinishAt.time}
                                        </small>
                                    </>
                                )}


                            </h5>



                            <Divider/>
                            <strong className={`my-5 d-flex justify-content-start`}>
                                Vue d'ensemble
                            </strong>


                            <Row className={`w-100`} style={{position: 'relative'}}>

                                <Col span={12}
                                     className={"m-0 p-0 d-flex flex-column justify-content-start align-items-start pe-5"}>
                                    <h5>
                                        Phase initiale du jeu
                                    </h5>

                                    <p>
                                        La première phase du jeu se déroulera sur une période de 30 jours, débutant
                                        le <strong className={"fw-bold"}>
                                        {gameConfigOriginal.startDate} à {gameConfigOriginal.time}
                                    </strong> et se clôturant le <strong className={"fw-bold"}>
                                        {principalPeriodFinishAt.startDate} à {principalPeriodFinishAt.time}
                                    </strong>.
                                    </p>

                                    <p>
                                        Les participants auront ensuite une période additionnelle de 30 jours après la
                                        fermeture de la première phase pour visiter le site internet, tester leurs
                                        tickets, et réclamer leurs lots, que ce soit en magasin ou en ligne.
                                    </p>

                                </Col>

                                <Col span={12}
                                     className={"m-0 p-0 d-flex flex-column justify-content-start align-items-start pe-5"}>
                                    <h5>
                                        Phase de validation
                                    </h5>

                                    <p>
                                        La seconde phase du jeu débutera immédiatement après la première, couvrant les
                                        30 jours suivants. La date de début sera <strong className={"fw-bold"}>
                                        {principalPeriodFinishAt.startDate} à {principalPeriodFinishAt.time}
                                    </strong> et la clôture aura lieu le <strong className={"fw-bold"}>
                                        {validationPeriodFinishAt.startDate} à {validationPeriodFinishAt.time}
                                    </strong>.
                                    </p>

                                </Col>

                                <Col span={24}
                                     className={"m-0 p-0 d-flex flex-column justify-content-start align-items-start"}>
                                    <h5>
                                        {gameStatus === "A venir" && (
                                            <>
                                                Le jeu débute dans
                                            </>
                                        )}

                                        {gameStatus === "En cours" && (
                                            <>
                                                Fin du jeu dans
                                            </>
                                        )}

                                        {gameStatus === "Validation" && (
                                            <>
                                                Fin de la période de validation dans
                                            </>
                                        )}

                                        {gameStatus === "Terminé" && (
                                            <>
                                                Cloturé depuis
                                            </>
                                        )}

                                    </h5>
                                    <section className="timeContainer">
                                        <div className="wrapper">
                                            <div className="days">
                                                <h2 id="days">
                                                    {timeRemaining.days}
                                                </h2>
                                                Jours
                                            </div>
                                            <div className="hours">
                                                <h2 id="hours">
                                                    {timeRemaining.hours}
                                                </h2>
                                                Heures
                                            </div>
                                            <div className="minutes">
                                                <h2 id="minutes">
                                                    {timeRemaining.minutes}
                                                </h2>
                                                Minutes
                                            </div>
                                            <div className="seconds">
                                                <h2 id="seconds">
                                                    {timeRemaining.seconds}
                                                </h2>
                                                Secondes
                                            </div>
                                        </div>
                                    </section>
                                </Col>

                            </Row>


                        </div>

                    </div>

                </div>
            </div>


        </div>
        );
}

export default TirageAuSortBailiffTemplate;