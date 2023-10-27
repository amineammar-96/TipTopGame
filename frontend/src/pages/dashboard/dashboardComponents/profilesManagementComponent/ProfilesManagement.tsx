import React, {useState} from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import {Row , Col} from "antd";
import StoresList from "@/pages/dashboard/dashboardComponents/profilesManagementComponent/StoresList";
import ProfilesUsersTable from "@/pages/dashboard/dashboardComponents/profilesManagementComponent/ProfilesUsersTable";
import { Result } from 'antd';

function ProfilesManagement() {

    const [selectedStoreId, setSelectedStoreId] = useState<string>('');

    const handleStoreChange = (value: string) => {
        setSelectedStoreId(value);
    };



        return (
            <div className={styles.topHeaderStoreManagementFullWidth} >
                <Row>
                    <Col className={`${styles.fullWidthElement} mt-3`} >
                        <h3 className={styles.topHeaderProfileManagementTitle} >Gestion des profils</h3>
                    </Col>
                    <Col className={`${styles.fullWidthElement} mb-5`} >
                        <StoresList onSelectStore={handleStoreChange} ></StoresList>
                    </Col>

                    {selectedStoreId && (
                        <Col className={styles.fullWidthElement} >
                            <ProfilesUsersTable selectedStoreId={selectedStoreId}></ProfilesUsersTable>
                        </Col>
                    )}

                    {!selectedStoreId && (
                        <Col className={styles.fullWidthElement} >
                            <Result
                                status="warning"
                                title="Aucun magasin sélectionné"
                                extra={
                                   <>
                                   </>
                                }
                            />
                        </Col>
                    )}

                </Row>
            </div>
        );

}

export default ProfilesManagement;