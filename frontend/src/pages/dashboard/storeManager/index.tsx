import React, {Component, useEffect, useState} from 'react';
import Sidebar from "@/pages/dashboard/storeManager/components/sidebar";
import {Row,Col} from "antd";
import TopNavBar from "@/pages/dashboard/storeManager/components/topNavBar";
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
import GameGainHistoryPage from "@/pages/dashboard/dashboardComponents/GameGainHistory/GameGainHistoryPage";
import SpinnigLoader from "@/app/components/widgets/SpinnigLoader";
import GeneralSettingsTemplates
    from "@/pages/dashboard/dashboardComponents/GeneralSettingsComponents/GeneralSettingsTemplates";

function storeAdminDashboard() {

    const { redirectUserToHomePage } = RedirectService();


    const [selectedMenuItem, setSelectedMenuItem] = useState<string>("dashboardItem");

    useEffect(() => {
        const selectedMenuItemSaved = localStorage.getItem("selectedMenuItem");
        if (selectedMenuItemSaved) {
            setSelectedMenuItem(selectedMenuItemSaved);
        }
    }, [selectedMenuItem]);

    const handleMenuItemClick = (menuItemKey: string) => {
        setSelectedMenuItem(menuItemKey);
        localStorage.setItem("selectedMenuItem", menuItemKey);
    };

    const [collapsed, setCollapsed] = useState(false);

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
            setLoading(false);
        }
        if (userRrole == "ROLE_EMPLOYEE") {
            window.location.href = '/dashboard/storeEmployee';
        }
        if (userRrole == "ROLE_CLIENT") {
            window.location.href = '/dashboard/client';
        }

        if (userRrole == "ROLE_ADMIN") {
            window.location.href = '/dashboard/storeAdmin';
        }


    }, [userRrole]);


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
                            {selectedMenuItem==="storesManagementItem" && <StoresManagement></StoresManagement>}
                            {selectedMenuItem==="profilesManagementItem" && <ProfilesManagement></ProfilesManagement>}
                            {selectedMenuItem==="ticketsItem" && <TicketsPageDashboard></TicketsPageDashboard>}
                            {selectedMenuItem==="prizesLotsItem" && <PrizesListPage></PrizesListPage>}
                            {selectedMenuItem==="statisticItemClients" && <ClientManagementPageDashboard></ClientManagementPageDashboard>}
                            {selectedMenuItem==="statisticItemPrizes" && <ParticipantManagementPageDashboard></ParticipantManagementPageDashboard>}
                            {selectedMenuItem==="historyPrizesItem" && <GameGainHistoryPage></GameGainHistoryPage>}

                            {selectedMenuItem==="generalSettingsItem" && <GeneralSettingsTemplates></GeneralSettingsTemplates>}

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