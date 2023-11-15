import React, {useEffect, useRef, useState} from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import TicketImage from "@/assets/images/ticket.png";
import CodeScanner from "@/assets/images/scan.png";
import RemainsTickes from "@/assets/images/remainsTickes.png";
import ClientsImg from "@/assets/images/clients.png";
import UsersImg from "@/assets/images/users.png";
import RouletteImg from "@/assets/images/roulette.png";
import { Card, Col, Row } from 'antd';
import Image from 'next/image';
import {CityStatsChart} from "@/pages/dashboard/dashboardComponents/homePageComponent/components/CityStatsChart";
import {
    PrizesChartDoughunt
} from "@/pages/dashboard/dashboardComponents/homePageComponent/components/PrizesChartDoughnut";

import CalendarImg from "@/assets/images/calendar.png";
import PriceImg from "@/assets/images/price.png";
import PlayImg from "@/assets/images/play.png";

import StoresList from "@/pages/dashboard/dashboardComponents/homePageComponent/components/StoresListHomePage";
import {
    Button,
    ConfigProvider,
    DatePicker,
    DatePickerProps,
} from "antd";


import locale from "antd/locale/fr_FR";
import dayjs from "dayjs";
import frFR from 'antd/lib/locale/fr_FR';
import {
    PrizesStatsWithAgeChart
} from "@/pages/dashboard/dashboardComponents/homePageComponent/components/PrizesStatsWithAgeChart";
import {
    PrizesStatsWithSexChart
} from "@/pages/dashboard/dashboardComponents/homePageComponent/components/PrizesStatsWithSexChart";
import {
    GamePlayedStatsChart
} from "@/pages/dashboard/dashboardComponents/homePageComponent/components/GamePlayedStatsChart";
import {
    TopTeenParticipants
} from "@/pages/dashboard/dashboardComponents/homePageComponent/components/TopTeenParticipants";
import {
    PrizesWinStatsByStore
} from "@/pages/dashboard/dashboardComponents/homePageComponent/components/PrizesWinStatsByStore";
import {getAdminDashboardCardsCounters, getClientDashboardCardsCounters} from "@/app/api";

const dateFormat = 'DD/MM/YYYY';

function HomePage() {
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [isStoresUpdated, setIsStoresUpdated] = useState(false);
    const { RangePicker } = DatePicker;

    const handleDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        if (dateString && date) {
            console.log(date.format('DD/MM/YYYY'));
            let ch = date.format('DD/MM/YYYY');
            //setUserForm((prevFormData) => ({
            //  ...prevFormData,
            // dateOfBirth: ch,
            //}));
        }
    };

    const handleStoreChange = (value: string) => {
        setSelectedStoreId(value);
    };

    const [userRole, setUserRole] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [adminDashboardCardsCounters, setAdminDashboardCardsCounters] = useState<any>({});
    useEffect(() => {
        const tokenAux = localStorage.getItem('loggedInUserToken');
        const userRoleAux = localStorage.getItem('loggedInUserRole');
        if (token && userRole) {
            setToken(tokenAux as string);
            setUserRole(userRoleAux as string);
        }
        if (userRoleAux == "ROLE_ADMIN") {
            getAdminDashboardCardsCounters().then((res) => {
                setAdminDashboardCardsCounters(res.counters);
            }).catch((err) => {
                console.log(err);
            });
        }

    }, []);

    return (
        <div className={styles.homePageContent}>

            <div className={`${styles.homePageContentTopHeader}`}>
                <h1 className={`mx-3`}>Tableau de bord </h1>
                <div className={`${styles.homePageAdminCardsDiv}`}>

                    <Row className={`${styles.fullWidthElement} w-100`} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                        <Col className={`w-100 d-flex`} sm={24} md={12} lg={8} span={6}>
                            <div className={`${styles.topCardElement}`}>
                                <div className={`${styles.topCardElementIcon}`}>
                                    <Image src={RemainsTickes}  alt={"tickets"}></Image>

                                </div>
                                <div className={`${styles.topCardElementText}`}>
                                    <div className={`${styles.counter}`}>
                                        {adminDashboardCardsCounters["tickets"]}
                                    </div>

                                    <div className={`${styles.cardTitle}`}>Total Des Lots</div>
                                </div>
                            </div>
                        </Col>
                        <Col className={`w-100 d-flex`} sm={24} md={12} lg={8} span={6}>
                            <div className={`${styles.topCardElement}`}>
                                <div className={`${styles.topCardElementIcon}`}>
                                    <Image src={CodeScanner}  alt={"tickets"}></Image>
                                </div>
                                <div className={`${styles.topCardElementText}`}>
                                    <div className={`${styles.counter}`}>
                                        {adminDashboardCardsCounters["printedTickets"]}
                                    </div>

                                    <div className={`${styles.cardTitle}`}>Bons Imprimés</div>
                                </div>
                            </div>
                        </Col>
                        <Col className={`w-100 d-flex`} sm={24} md={12} lg={8} span={6}>
                            <div className={`${styles.topCardElement}`}>
                                <div className={`${styles.topCardElementIcon}`}>
                                    <Image src={TicketImage}  alt={"tickets"}></Image>
                                </div>
                                <div className={`${styles.topCardElementText}`}>
                                    <div className={`${styles.counter}`}>
                                        {adminDashboardCardsCounters["ticketStock"]}
                                    </div>

                                    <div className={`${styles.cardTitle}`}>Lots Restants</div>
                                </div>
                            </div>
                        </Col>
                        <Col className={`w-100 d-flex`} sm={24} md={12} lg={8} span={6}>
                            <div className={`${styles.topCardElement}`}>
                                <div className={`${styles.topCardElementIcon}`}>
                                    <Image src={UsersImg}  alt={"tickets"}></Image>
                                </div>
                                <div className={`${styles.topCardElementText}`}>
                                    <div className={`${styles.counter}`}>
                                        {adminDashboardCardsCounters["clients"]}
                                    </div>

                                    <div className={`${styles.cardTitle}`}>Clients Inscrits</div>
                                </div>
                            </div>
                        </Col>
                        <Col className={`w-100 d-flex`} sm={24} md={12} lg={8} span={6}>
                            <div className={`${styles.topCardElement}`}>
                                <div className={`${styles.topCardElementIcon}`}>
                                    <Image src={ClientsImg}  alt={"tickets"}></Image>
                                </div>
                                <div className={`${styles.topCardElementText}`}>
                                    <div className={`${styles.counter}`}>
                                        {adminDashboardCardsCounters["participants"]}
                                    </div>
                                    <div className={`${styles.cardTitle}`}>Participants Actifs</div>

                                </div>
                            </div>
                        </Col>
                        <Col className={`w-100 d-flex`} sm={24} md={12} lg={8} span={6}>
                            <div className={`${styles.topCardElement}`}>
                                <div className={`${styles.topCardElementIcon}`}>
                                    <Image src={RouletteImg}  alt={"tickets"}></Image>
                                </div>
                                <div className={`${styles.topCardElementText}`}>
                                    <div className={`${styles.counter}`}>
                                        {adminDashboardCardsCounters["playedTicket"]}
                                    </div>
                                    <div className={`${styles.cardTitle}`}>Tickets Utilisés</div>
                                </div>
                            </div>
                        </Col>

                    </Row>

                </div>
            </div>

            <div className={`${styles.homePageContentStats}`}>
                <h2 className={`mx-3`}>Vue d'Ensemble du Jeu (Statistiques)</h2>
                <div className={`${styles.homePageAdminStatsDiv}`}>

                    <Row className={`${styles.fullWidthElement} w-100`} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                        <div className={`${styles.boxShadowDiv}`}>
                            <Row className={`${styles.fullWidthElement} w-100`} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                                <Col className={`w-100 mb-0 pb-0 ${styles.statsTopHeadetFilterDiv}`} sm={24} md={24} lg={24} span={6}>
                                    <h5 className={`px-3 mb-0 pb-0`}>
                                        Filtres de Recherche
                                    </h5>
                                </Col>
                                <Col className={`w-100 pt-0 mt-0 ${styles.statsTopHeadetFilterDiv}`} sm={24} md={24} lg={24} span={6}>
                                    <div className={`${styles.headetFilterDiv}`}>
                                        <StoresList globalSelectedStoreId={selectedStoreId} onSelectStore={handleStoreChange}></StoresList>
                                        <ConfigProvider locale={locale}>

                                            <RangePicker
                                                className={`${styles.datePickerDashboardHomePage}`}
                                                onChange={()=>{
                                                    handleDateChange
                                                }}
                                                placeholder={['Date de début', 'Date de fin']}
                                                format={dateFormat}
                                                cellRender={(current) => {
                                                    const style: React.CSSProperties = {};
                                                    if (current.date() === 1) {
                                                        style.border = '1px solid #1677ff';
                                                        style.borderRadius = '50%';
                                                    }
                                                    return (
                                                        <div className="ant-picker-cell-inner" style={style}>
                                                            {current.date()}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </ConfigProvider>
                                    </div>
                                </Col>
                                <Col className={`w-100 ${styles.statsCharts}`} sm={24} md={24} lg={12} span={6}>
                                    <h5 className={'mb-0'}>
                                        Résultat De Recherche
                                    </h5>
                                    <div className={`${styles.fullWidthElement}`}>
                                        <Row className={`${styles.fullWidthElement} w-100`} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                                            <Col className={`w-100 d-flex`} sm={24} md={24} lg={12} span={12}>
                                                <div className={`${styles.topCardElement}`}>
                                                    <div className={`${styles.topCardElementIconBadge}`}>
                                                        <Image src={CalendarImg}  alt={"Dates"}></Image>
                                                    </div>
                                                    <div className={`${styles.topCardElementText} ${styles.topCardElementTextDates}`}>
                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>Date de début</div>
                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>12/23/2023</div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col className={`w-100 d-flex`} sm={24} md={24} lg={12} span={12}>
                                                <div className={`${styles.topCardElement}`}>
                                                    <div className={`${styles.topCardElementIconBadge}`}>
                                                        <Image src={CalendarImg}  alt={"Dates"}></Image>
                                                    </div>
                                                    <div className={`${styles.topCardElementText} ${styles.topCardElementTextDates}`}>
                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>Date de fin</div>
                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>12/23/2023</div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className={`${styles.fullWidthElement} w-100`} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                                            <Col className={`w-100 d-flex`} sm={24} md={24} lg={12} span={12}>
                                                <div className={`${styles.topCardElement}`}>
                                                    <div className={`${styles.topCardElementIconBadge}`}>
                                                        <Image src={PlayImg}  alt={"Nombres de jeu"}></Image>
                                                    </div>
                                                    <div className={`${styles.topCardElementText}`}>
                                                        <div className={`${styles.topCardElementTextDatesCounter}`}>234.000</div>

                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>Nombres de jeu</div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col className={`w-100 d-flex`} sm={24} md={24} lg={12} span={12}>
                                                <div className={`${styles.topCardElement}`}>
                                                    <div className={`${styles.topCardElementIconBadge}`}>
                                                        <Image src={PriceImg}  alt={"Montants des gains "}></Image>
                                                    </div>
                                                    <div className={`${styles.topCardElementText}`}>
                                                        <div className={`${styles.topCardElementTextDatesCounter}`}>500.000 €</div>

                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>Charges Totales</div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    <h5 className={'mb-0'}>
                                        Répartition Des Cadeaux En Fonction De Sexe
                                    </h5>
                                    <PrizesStatsWithSexChart/>

                                </Col>
                                <Col className={`w-100 ${styles.statsCharts}`} sm={24} md={24} lg={12} span={6}>
                                    <h5>
                                        Répartition des Tickets Distribués
                                    </h5>
                                    <PrizesChartDoughunt/>
                                </Col>

                                <Col className={`w-100 ${styles.statsCharts}`} sm={24} md={24} lg={12} span={6}>

                                    <h5>
                                        Participants Les Plus Engagés
                                    </h5>
                                    <TopTeenParticipants/>
                                    <h5 className={`mt-5`}>
                                        Répartition Des Cadeaux En Fonction De L'âge
                                    </h5>
                                    <PrizesStatsWithAgeChart/>
                                </Col>
                                <Col className={`w-100 ${styles.statsCharts}`} sm={24} md={24} lg={12} span={6}>
                                    <h5>
                                        Analyse des Participants
                                    </h5>

                                    <CityStatsChart/>

                                    <GamePlayedStatsChart/>

                                    <h5>
                                        Répartition des Gagnants par Magasin
                                    </h5>
                                    <PrizesWinStatsByStore/>

                                </Col>

                            </Row>
                        </div>
                    </Row>

                </div>
            </div>

        </div>
    );
}

export default HomePage;