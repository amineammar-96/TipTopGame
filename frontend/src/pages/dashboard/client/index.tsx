import React , {useEffect , useState} from 'react';
import RedirectService from '../../../app/service/RedirectService';

import Sidebar from "@/pages/dashboard/client/components/sidebar";
import TopNavBar from "@/pages/dashboard/client/components/topNavBar";

import {Row,Col} from "antd";
import styles from "@/styles/pages/dashboards/clientDashboard.module.css";
import "@/styles/pages/dashboards/globalDashboardStyle.css";

import { Space, Spin } from 'antd';
import ClientHomePage from "@/pages/dashboard/dashboardComponents/homePageComponent/HomePageDashboard";
import StoresManagement from "@/pages/dashboard/dashboardComponents/storeManagementComponent/StoresManagement";
import ProfilesManagement from "@/pages/dashboard/dashboardComponents/profilesManagementComponent/ProfilesManagement";
import TicketsPageDashboard from "@/pages/dashboard/dashboardComponents/TicketsPageComponent/TicketsPageDashboard";
import PrizesListPage from "@/pages/dashboard/dashboardComponents/PrizesPageComponent/PrizesListPage";
import ClientManagementPageDashboard
    from "@/pages/dashboard/dashboardComponents/ClientManagementComponents/ClientManagementPageDashboard";
import ParticipantManagementPageDashboard
    from "@/pages/dashboard/dashboardComponents/ClientManagementComponents/ParticipantManagementPageDashboard";
import PlayGameComponent from "@/pages/dashboard/client/components/PlayGameComponent";

import SpinnigLoader from "@/app/components/widgets/SpinnigLoader";
import GameGainHistoryPage from "@/pages/dashboard/dashboardComponents/GameGainHistory/GameGainHistoryPage";
import GeneralSettingsTemplates
    from "@/pages/dashboard/dashboardComponents/GeneralSettingsComponents/GeneralSettingsTemplates";


function ClientDashboard() {
    const { redirectUserToHomePage } = RedirectService();
    const [loading, setLoading] = useState(true);

    const [selectedMenuItem, setSelectedMenuItem] = useState<string>("playGameItem");

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

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        const firstLoginClientStatus = localStorage.getItem('firstLoginClientStatus');
        if (firstLoginClientStatus == "true") {
            window.location.href = '/dashboard/client/favoriteStoreSelection';
        }else {
            setLoading(false);
        }
    }, []);


    const [userRrole , setUserRole] = useState<string | null>(null);
    const [userToken , setUserToken] = useState<string | null>(null);
    useEffect(() => {
        setUserRole(localStorage.getItem('loggedInUserRole'));
        setUserToken(localStorage.getItem('loggedInUserToken'));
        if (userToken == null && userToken == "") {
            window.location.href = '/client_login';
        }
        setLoading(true)
    }, []);

    useEffect(() => {
        setLoading(true);
        if (userRrole == "ROLE_STOREMANAGER") {
            window.location.href = '/dashboard/storeManager';
        }
        if (userRrole == "ROLE_EMPLOYEE") {
            window.location.href = '/dashboard/storeEmployee';
        }
        if (userRrole == "ROLE_CLIENT") {
            setLoading(false);
        }

        if (userRrole == "ROLE_ADMIN") {
            window.location.href = '/dashboard/storeAdmin';
        }



        }, [userRrole]);

    return (
        <>
            {loading && (
                <SpinnigLoader></SpinnigLoader>
            )}
            {!loading && (
                <>
        <div>
            {loading && <SpinnigLoader></SpinnigLoader>}

            {!loading &&
            <Row>
                <Col md={collapsed ? '': 4 }>
                    <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} onMenuItemClick={handleMenuItemClick} selectedMenuItem={selectedMenuItem}></Sidebar>
                </Col>
                <Col md={collapsed ? '': 20 } className={styles.mainPageDiv}>
                    <Row>
                        <TopNavBar></TopNavBar>
                    </Row>
                    <Row className={styles.mainContent}>
                        {selectedMenuItem==="dashboardItem" && <ClientHomePage></ClientHomePage>}
                        {selectedMenuItem==="storesManagementItem" && <StoresManagement></StoresManagement>}
                        {selectedMenuItem==="profilesManagementItem" && <ProfilesManagement></ProfilesManagement>}
                        {selectedMenuItem==="ticketsItem" && <TicketsPageDashboard></TicketsPageDashboard>}
                        {selectedMenuItem==="prizesLotsItem" && <PrizesListPage></PrizesListPage>}
                        {selectedMenuItem==="statisticItemClients" && <ClientManagementPageDashboard></ClientManagementPageDashboard>}
                        {selectedMenuItem==="statisticItemPrizes" && <ParticipantManagementPageDashboard></ParticipantManagementPageDashboard>}
                        {selectedMenuItem==="playGameItem" && <PlayGameComponent></PlayGameComponent>}
                        {selectedMenuItem==="historyPrizesItem" && <GameGainHistoryPage></GameGainHistoryPage>}
                        {selectedMenuItem==="settingsItem" && <GeneralSettingsTemplates></GeneralSettingsTemplates>}



                    </Row>
                </Col>
            </Row>
            }
        </div>
                </>
            )}
        </>
    );

}

export default ClientDashboard;