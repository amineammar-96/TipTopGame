import React, {useEffect, useRef, useState} from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import TiptopEmployeeImg from "@/assets/images/tiptopEmployee.png";

import RouletteImg from "@/assets/images/roulette.png";
import {Avatar, Card, Col, Row} from 'antd';
import Image from 'next/image';
import {CityStatsChart} from "@/pages/dashboard/dashboardComponents/homePageComponent/components/CityStatsChart";
import {
    PrizesChartDoughunt
} from "@/pages/dashboard/dashboardComponents/homePageComponent/components/PrizesChartDoughnut";

import CalendarImg from "@/assets/images/calendar.png";
import PriceImg from "@/assets/images/price.png";
import PlayImg from "@/assets/images/play.png";
import GiftsImg from "@/assets/images/surprisePlus.png";

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
import style from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import {getClientDashboardCardsCounters} from "@/app/api";

const dateFormat = 'DD/MM/YYYY';

function HomePage() {
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [isStoresUpdated, setIsStoresUpdated] = useState(false);
    const { RangePicker } = DatePicker;
    const [userForm, setUserForm] = useState({
        dateOfBirth: {
            date: '',
            time: '',
        },
        email: '',
        password: '',
        phone: '',
        firstname: '',
        lastname: '',
        gender: '',
        address: '',
        stores: [],
    });
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

    const [userRole , setUserRole] = useState<string | null>(null);
    const [userToken , setUserToken] = useState<string | null>(null);
    const [clientCounter, setClientCounter] = useState<any>(null);
    useEffect(() => {
        const userRoleAux = localStorage.getItem('loggedInUserRole');
        setUserRole(localStorage.getItem('loggedInUserRole'));
        setUserToken(localStorage.getItem('loggedInUserToken'));
        if (userRoleAux == "ROLE_CLIENT" ) {
            getClientDashboardCounters();
        }
    }, []);
    function getClientDashboardCounters() {
        getClientDashboardCardsCounters().then((res) => {
            console.log(res.counters);
            setClientCounter(res.counters);
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        console.log(clientCounter, 'clientCounterclientCounterclientCounter');

    }, [clientCounter]);

    useEffect(() => {
        const userLoggedIn = localStorage.getItem("loggedInUser");
        if (userLoggedIn) {

            const user = JSON.parse(userLoggedIn);
            setUserForm((prevFormData) => ({
                ...prevFormData,
                lastname: user.lastname,
                firstname: user.firstname,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                address: user.address,
                stores: user.stores[0],
            }));
        }

    }, []);

    useEffect(() => {
        console.log(selectedStoreId, 'selectedStoreId');
        console.log(userForm, 'userFormuserFormuserFormuserForm');
    }, [userForm]);

    const handleStoreChange = (value: string) => {
        setSelectedStoreId(value);
    };

    const formatDate = (date: any) => {

        const originalDate = new Date(date);

        console.log(originalDate , 'originalDate');
        console.log(originalDate.getDate() , 'originalDate.getDate()');

        const day = originalDate.getDate().toString().padStart(2, '0');
        const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1.
        const year = originalDate.getFullYear();

        return  `${day}-${month}-${year}`;
    }

    return (

        <div className={styles.homePageContent}>



            <div className={`${styles.homePageContentTopHeader}`}>
                <h1 className={`mx-3`}>Tableau de bord </h1>
                <div className={`${styles.homePageAdminCardsDiv}`}>

                    <Row className={`${styles.fullWidthElement} w-100 d-flex justify-content-center`} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >


                        <Col className={`w-100 d-flex`} sm={24} md={12} lg={6} span={6}>

                        <div className={`${styles.clientTopCardDashboard} ${styles.topCardElementAux}`}>
                                <div className={`${styles.topCardElementText}`}>
                                    <div className={`${styles.counter}`}>
                                        {clientCounter?.["playedTickets"]}
                                    </div>
                                    <div className={`${styles.cardTitle}`}>
                                        Tours Joués
                                    </div>
                                </div>
                                <div className={`${styles.topCardElementIcon}`}>
                                    <Image src={RouletteImg}  alt={"tickets"}></Image>
                                </div>
                            </div>
                        </Col>
                        <Col className={`w-100 d-flex`} sm={24} md={12} lg={6} span={6}>

                        <div className={`${styles.clientTopCardDashboard} ${styles.topCardElementAux}`}>
                                <div className={`${styles.topCardElementText}`}>
                                    <div className={`${styles.counter}`}>
                                        {clientCounter?.["confirmedTickets"]}
                                    </div>
                                    <div className={`${styles.cardTitle}`}>
                                        Cadeaux Réclamés
                                    </div>
                                </div>
                                <div className={`${styles.topCardElementIcon}`}>
                                    <Image src={GiftsImg}  alt={"GiftsImg"}></Image>
                                </div>
                            </div>

                        </Col>

                        <Col className={`w-100 d-flex`} sm={24} md={12} lg={6} span={6}>

                            <div className={`${styles.clientTopCardDashboard} ${styles.topCardElementAux}`}>
                                <div className={`${styles.topCardElementText}`}>
                                    <div className={`${styles.counter}`}>
                                        {clientCounter?.["pendingTickets"]}
                                    </div>
                                    <div className={`${styles.cardTitle}`}>
                                        En attente de validation
                                    </div>
                                </div>
                                <div className={`${styles.topCardElementIcon}`}>
                                    <Image src={TiptopEmployeeImg}  alt={"GiftsImg"}></Image>
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

                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>Gain Totales</div>
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