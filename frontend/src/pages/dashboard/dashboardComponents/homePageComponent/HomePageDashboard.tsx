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
import {getAdminDashboardCardsCounters, getClientDashboardCardsCounters, getDashboardStatsData} from "@/app/api";
import { PrizesStatsByStatusesChart } from './components/PrizesStatsByStatusesChart';
import { GameStatusesTendanceStatsChart } from './components/GameStatusesTendanceStatsChart';
import { PrizeStatsByGenderByAgeChart } from './components/PrizeStatsByGenderByAgeChart';
import { PrizesCostTendance } from './components/PrizesCostTendance';

const dateFormat = 'DD/MM/YYYY';

export interface SeachParams {
    startDate?: string;
    endDate?: string;
    storeId?: string;
}

const search: SeachParams = {
    startDate: '01/01/2022',
    endDate: '30/12/2024',
    storeId: '',
};

function HomePage() {
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [isStoresUpdated, setIsStoresUpdated] = useState(false);
    const { RangePicker } = DatePicker;

    const [searchForm, setSearchForm] = useState<SeachParams>(search);


    const handleDateChange: any = (date : any, dateString :any)  => {


        setSearchForm((prevFormData) => ({
            ...prevFormData,
            startDate: dateString[0],
            endDate: dateString[1],
        }));
    };

    const handleStoreChange = (value: string) => {
        setSelectedStoreId(value);
        setSearchForm((prevFormData) => ({
            ...prevFormData,
            storeId: value,
        }));
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


    const [statsData, setStatsData] = useState<any>({});
    useEffect(() => {
        getDashboardStatsData(searchForm).then((res) => {
            setStatsData(res);
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }, [searchForm]);


    const [gainByPrizeData, setGainByPrizeData] = useState<any>([]);
    const [gainByPrizeChartToggle, setGainByPrizeChartToggle] = useState(0);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["gainByPrize"];
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setGainByPrizeChartToggle(gainByPrizeChartToggle + 1);
            setGainByPrizeData(finalData);
        }
    }, [statsData]);

    const [gainByGenderData, setGainByGenderData] = useState<any>([]);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["gainByGender"];
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setGainByGenderData(finalData);
        }
    }, [statsData]);

    const [gainByCityData, setGainByCityData] = useState<any>([]);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["gainByCity"];
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setGainByCityData(finalData);
        }
    }, [statsData]);


    const [gainByAgeData, setGainByAgeData] = useState<any>([]);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["gainByAge"];
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setGainByAgeData(finalData);
        }
    }, [statsData]);


    const [gainByStoresData, setGainByStoresData] = useState<any>([]);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["gainByStores"];
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setGainByStoresData(finalData);
        }
    }, [statsData]);


    const [topGainTableData, setTopGainTableData] = useState<any>([]);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["topGain"]
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });


            setTopGainTableData(finalData);
        }
    }, [statsData]);


    const [gainTendanceData, setGainTendanceData] = useState<any>([]);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["participationTendance"];
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setGainTendanceData(finalData);
        }
    }, [statsData]);

    const [ticketsByStatuses, setTicketsByStatuses] = useState<any>([]);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["ticketsByStatuses"];
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setTicketsByStatuses(finalData);
        }
    }, [statsData]);

    const [gainByGenderByAge, setGainByGenderByAge] = useState<any>([]);

    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["gainByGenderByAge"];
            console.log(dataAux , "dataAux");
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setGainByGenderByAge(finalData);
        }
    }, [statsData]);


    const [playGameTendanceData, setPlayGameTendanceData] = useState<any>([]);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["playGameTendance"];
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setPlayGameTendanceData(finalData);
        }
    }, [statsData]);



    const [prizesCostTendanceData, setPrizesCostTendanceData] = useState<any>([]);
    useEffect(() => {
        if (statsData && Object.keys(statsData).length !== 0) {
            let dataAux = statsData["stats"]["prizesCostTendance"];
            console.log(dataAux , "dataAux");
            let finalData:any[] = [];
            Object.entries(dataAux).map(([key, value]) => {
                let data = {
                    "label": key,
                    "value": value,
                };
                finalData.push(data);
            });
            setPrizesCostTendanceData(finalData);
        }
    }, [statsData]);





    // @ts-ignore
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
                                                onChange={(date:any , dateString:any )=>{
                                                    handleDateChange(date  , dateString)
                                                }}
                                                value={[dayjs(searchForm.startDate, dateFormat), dayjs(searchForm.endDate, dateFormat)]}
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
                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>
                                                            {statsData["startDate"]}
                                                        </div>
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
                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>
                                                            {statsData["endDate"]}
                                                        </div>
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
                                                        <div className={`${styles.topCardElementTextDatesCounter}`}>
                                                            {statsData["gameCount"]}
                                                        </div>

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
                                                        <div className={`${styles.topCardElementTextDatesCounter}`}>
                                                            {statsData["totalGainAmount"]}
                                                            €</div>

                                                        <div className={`${styles.topCardElementTextDatesTitle}`}>Charges Totales</div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    <GameStatusesTendanceStatsChart key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataChart={gainTendanceData}/>


                                </Col>
                                <Col className={`w-100 ${styles.statsCharts}`} sm={24} md={24} lg={12} span={6}>
                                    <h5 className={`mt-5`}>
                                        Répartition Des Tickets en Fonction de Statut
                                    </h5>
                                    <PrizesStatsByStatusesChart key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataChart={ticketsByStatuses} />
                                </Col>
                                <Col className={`w-100 ${styles.statsCharts}`} sm={24} md={24} lg={12} span={6}>
                                    <h5 className={`mt-5`}>
                                        Analyse des Tickets
                                    </h5>
                                    <GamePlayedStatsChart key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataChart={playGameTendanceData}/>

                                    <PrizesCostTendance key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataChart={prizesCostTendanceData}/>


                                </Col>
                                <Col className={`w-100 ${styles.statsCharts}`} sm={24} md={24} lg={12} span={6}>
                                    <h5>
                                        Répartition des Tickets Distribués
                                    </h5>
                                    <PrizesChartDoughunt key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataChart={gainByPrizeData}/>

                                </Col>

                                <Col className={`w-100 ${styles.statsCharts}`} sm={24} md={24} lg={12} span={6}>

                                    <h5>
                                        Participants Les Plus Engagés
                                    </h5>
                                    <TopTeenParticipants key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataTable={topGainTableData} />
                                    <h5 className={`mt-5`}>
                                        Répartition Des Cadeaux En Fonction De L'âge
                                    </h5>
                                    <PrizesStatsWithAgeChart key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataChart={gainByAgeData} />

                                </Col>
                                <Col className={`w-100 ${styles.statsCharts}`} sm={24} md={24} lg={12} span={6}>
                                    <h5>
                                        Analyse des Participants
                                    </h5>


                                    <PrizesStatsWithSexChart key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataChart={gainByGenderData}/>

                                    <PrizeStatsByGenderByAgeChart key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataChart={gainByGenderByAge}/>

                                    {
                                        gainByCityData.length > 0 && (
                                            <>
                                                <CityStatsChart key={`${gainByPrizeChartToggle }${Math.random().toString(36).substring(7)}`} dataChart={gainByCityData}/>
                                            </>
                                        )
                                    }



                                    <h5>
                                        Répartition des Gagnants par Magasin
                                    </h5>
                                    <PrizesWinStatsByStore key={gainByPrizeChartToggle} dataChart={gainByStoresData}/>

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