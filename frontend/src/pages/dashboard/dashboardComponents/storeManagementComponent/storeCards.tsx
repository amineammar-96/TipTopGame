import React, {useState , useEffect} from 'react';
import { Card, Col, Row } from 'antd';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import "@/styles/pages/dashboards/dashboardStoreCards.css";
import {getStoresForAdmin} from '@/app/api';




interface storeCardsProps {
    isStoresUpdated: boolean;
}

function StoreCards({isStoresUpdated}: storeCardsProps) {

    const [openStoresCount, setOpenStoresCount] = useState(0);
    const [closedStoresCount, setClosedStoresCount] = useState(0);

    useEffect(() => {
        getStoresForAdmin().then((response) => {
            setOpenStoresCount(response.openStoresCount);
            setClosedStoresCount(response.closedStoresCount);
        }).catch((err) => {
            console.log(err);
        });
}, [isStoresUpdated]);


        return (
            <div className={styles.topHeaderStoreManagementFullWidth}>
                <Row className={styles.topHeadersCard} gutter={16}>
                    <Col span={8}>
                        <Card className={styles.topCardElement} title="Nombres de magasins" bordered={false}>
                            {openStoresCount + closedStoresCount}
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className={styles.topCardElement} title="Nombres de magasins ouverts" bordered={false}>
                            {openStoresCount}
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className={styles.topCardElement} title="Nombres de magasins fermés" bordered={false}>
                            {closedStoresCount}
                        </Card>
                    </Col>
                </Row>
            </div>
        );

}

export default StoreCards;