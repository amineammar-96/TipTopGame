import React, {Component, useEffect, useState} from 'react';
import Sidebar from "@/pages/dashboard/storeAdmin/components/sidebar";
import {Row,Col} from "antd";
import TopNavBar from "@/pages/dashboard/storeAdmin/components/topNavBar";
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

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

        return (
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


                        </Row>
                    </Col>
                </Row>
            </div>
        );

}

export default storeAdminDashboard;