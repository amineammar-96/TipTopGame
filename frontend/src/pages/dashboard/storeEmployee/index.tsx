import React, {Component, useEffect, useState} from 'react';
import Sidebar from "@/pages/dashboard/storeEmployee/components/sidebar";
import {Row,Col} from "antd";
import TopNavBar from "@/pages/dashboard/storeEmployee/components/topNavBar";
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import "@/styles/pages/dashboards/globalDashboardStyle.css";
import StoresManagement from "@/pages/dashboard/dashboardComponents/storeManagementComponent/StoresManagement";


import RedirectService from "@/app/service/RedirectService";
import ProfilesManagement from "@/pages/dashboard/dashboardComponents/profilesManagementComponent/ProfilesManagement";
import HomePage from "@/pages/dashboard/dashboardComponents/homePageComponent/HomePageDashboard";
import TicketsPageDashboard from "@/pages/dashboard/dashboardComponents/TicketsPageComponent/TicketsPageDashboard";
import PrizesListPage from "@/pages/dashboard/dashboardComponents/PrizesPageComponent/PrizesListPage";
import ClientManagementPageDashboard
    from "@/pages/dashboard/dashboardComponents/ClientManagementComponents/ClientManagementPageDashboard";
import ParticipantManagementPageDashboard
    from "@/pages/dashboard/dashboardComponents/ClientManagementComponents/ParticipantManagementPageDashboard";
import PrintTicketsPage from "@/pages/dashboard/dashboardComponents/TicketsPageComponent/PrintTicketsPage";
import ConfirmTicketGain from "@/pages/dashboard/dashboardComponents/TicketsPageComponent/ConfirmTicketGain";
import GameGainHistoryPage from "@/pages/dashboard/dashboardComponents/GameGainHistory/GameGainHistoryPage";
import SpinnigLoader from "@/app/components/widgets/SpinnigLoader";

function storeAdminDashboard() {



    const [selectedMenuItem, setSelectedMenuItem] = useState<string>("dashboardItem");

    useEffect(() => {
        const selectedMenuItemSaved = localStorage.getItem("selectedMenuItem");
        if (selectedMenuItemSaved) {
            setSelectedMenuItem(selectedMenuItemSaved);
        }
    }, [selectedMenuItem]);

    const [userRrole , setUserRole] = useState<string | null>(null);
    const [loading , setLoading] = useState<boolean>(true);
    const [userToken , setUserToken] = useState<string | null>(null);
    useEffect(() => {
        setUserRole(localStorage.getItem('loggedInUserRole'));
        setUserToken(localStorage.getItem('loggedInUserToken'));
        if (userToken == null && userToken == "") {
            window.location.href = '/store_login';
        }
        setLoading(true)
    }, []);

    useEffect(() => {
        setLoading(true);
        if (userRrole == "ROLE_STOREMANAGER") {
            window.location.href = '/dashboard/storeManager';
        }
        if (userRrole == "ROLE_EMPLOYEE") {
            //window.location.href = '/dashboard/storeEmployee';
            setLoading(false);
        }
        if (userRrole == "ROLE_CLIENT") {
            window.location.href = '/dashboard/client';
        }

        if (userRrole == "ROLE_ADMIN") {
            window.location.href = '/dashboard/storeAdmin';
        }


    }, [userRrole]);

    const handleMenuItemClick = (menuItemKey: string) => {
        setSelectedMenuItem(menuItemKey);
        localStorage.setItem("selectedMenuItem", menuItemKey);
    };

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

        return (
            <>
                {loading && (
                    <SpinnigLoader></SpinnigLoader>
                )}
                {!loading && (
                    <>
            <div>

                <Row>
                    <Col md={collapsed ? '': 4 }>
                        <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} onMenuItemClick={handleMenuItemClick} selectedMenuItem={selectedMenuItem}></Sidebar>
                    </Col>
                    <Col md={collapsed ? '': 20 } className={styles.mainPageDiv}>
                        <Row>
                            <TopNavBar></TopNavBar>
                        </Row>
                        <Row className={styles.mainContent}>
                            {selectedMenuItem==="dashboardItem" && <HomePage></HomePage>}
                            {selectedMenuItem==="profilesManagementItem" && <ProfilesManagement></ProfilesManagement>}
                            {selectedMenuItem==="ticketsItem" && <TicketsPageDashboard></TicketsPageDashboard>}
                            {selectedMenuItem==="printTicketsItem" && <PrintTicketsPage></PrintTicketsPage>}

                            {selectedMenuItem==="prizesValidationItem" &&<ConfirmTicketGain></ConfirmTicketGain>}
                            {selectedMenuItem==="historyPrizesItem" && <GameGainHistoryPage></GameGainHistoryPage>}


                            {selectedMenuItem==="prizesLotsItem" && <PrizesListPage></PrizesListPage>}
                            {selectedMenuItem==="statisticItemClients" && <ClientManagementPageDashboard></ClientManagementPageDashboard>}
                            {selectedMenuItem==="statisticItemPrizes" && <ParticipantManagementPageDashboard></ParticipantManagementPageDashboard>}
                        </Row>
                    </Col>
                </Row>
            </div>
                        </>
                )}

            </>
        );

}

export default storeAdminDashboard;