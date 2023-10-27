import React , {useEffect , useState} from 'react';
import RedirectService from '../../../app/service/RedirectService';

import Sidebar from "@/pages/dashboard/client/components/sidebar";
import TopNavBar from "@/pages/dashboard/client/components/topNavBar";

import {Row,Col} from "antd";
import styles from "@/styles/pages/dashboards/clientDashboard.module.css";
import "@/styles/pages/dashboards/globalDashboardStyle.css";

import { Space, Spin } from 'antd';

function ClientDashboard() {
    const {redirectClientToAppropriatePage} = RedirectService();
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

    const [redirectionDone, setRedirectionDone] = useState(false);
    useEffect(() => {
        redirectClientToAppropriatePage();
        setTimeout(() => {
            setRedirectionDone(true);
        }, 4000);
    }, [])

    return (
        <div>
            {!redirectionDone &&
                <div className={`${styles.loadingDashboardFullPage}`}>
                    <Spin size="large" />
                </div>
            }
            {redirectionDone &&
                <Row>
                    <Col md={collapsed ? '': 4 }>
                        <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} onMenuItemClick={handleMenuItemClick} selectedMenuItem={selectedMenuItem}></Sidebar>
                    </Col>
                    <Col md={collapsed ? '': 20 } className={styles.mainPageDiv}>
                        <Row>
                            <TopNavBar></TopNavBar>
                        </Row>
                        <Row className={styles.mainContent}>
                            <h1>
                                Client Dashboard content works
                            </h1>
                        </Row>
                    </Col>
                </Row>
            }

        </div>
    );
}

export default ClientDashboard;