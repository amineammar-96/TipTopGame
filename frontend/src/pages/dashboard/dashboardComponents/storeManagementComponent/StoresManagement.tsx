import React, {useState} from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import StoreCards from "@/pages/dashboard/dashboardComponents/storeManagementComponent/storeCards";
import {Row , Col} from "antd";
import StoresList from "@/pages/dashboard/dashboardComponents/storeManagementComponent/StoresList";
import StoreDataInfoTable from "@/pages/dashboard/dashboardComponents/storeManagementComponent/StoreDataInfoTable";
function StoresManagement() {

    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [isStoresUpdated, setIsStoresUpdated] = useState(false);

    const handleStoreChange = (value: string) => {
        setSelectedStoreId(value);
    };



        return (
            <div className={styles.topHeaderStoreManagementFullWidth} >
                <Row>
                    <Col className={styles.topHeaderStoreManagementFullWidth} >
                        <StoreCards isStoresUpdated={isStoresUpdated} ></StoreCards>
                    </Col>
                </Row>
                <Row>
                    <Col className={styles.fullWidthElement} >
                        <StoresList globalSelectedStoreId={selectedStoreId} onSelectStore={handleStoreChange}  isStoresUpdated={isStoresUpdated} onStoreUpdate={() => setIsStoresUpdated(!isStoresUpdated)} ></StoresList>
                    </Col>
                </Row>
                <Row>
                    <Col className={`${styles.fullWidthElement} mx-5 mt-5`} >
                        <StoreDataInfoTable changeSelectedStore={()=> {
                            handleStoreChange(selectedStoreId)}}  isStoresUpdated={isStoresUpdated} onStoreUpdate={() => setIsStoresUpdated(!isStoresUpdated)} key={selectedStoreId} selectedStoreId={selectedStoreId}></StoreDataInfoTable>
                    </Col>
                </Row>
            </div>
        );

}

export default StoresManagement;