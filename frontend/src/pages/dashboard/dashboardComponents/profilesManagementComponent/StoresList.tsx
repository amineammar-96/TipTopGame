import React, {useEffect, useState} from 'react';
import {Button, Col, Row, Select} from 'antd';
import {getStoresForAdmin,getAllProfilesByStoreId} from "@/app/api";
import LogoutService from "@/app/service/LogoutService";
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import { MehOutlined} from "@ant-design/icons";


interface OptionType {
    city: string;
    postal_code: string;
    country: string;
    address: string;
    id: any;
    key: string;
    label: string;
    value: string;
    name: string;
    siren: string;
    status: string;
}

function StoresList({ onSelectStore   }: { onSelectStore: (value: string) => void;}) {


    const [selectedStoreId, setSelectedStoreId] = useState<string>('');

    function getAllUsersByStoreId(value: string) {
        getAllProfilesByStoreId(value).then((response) => {
            console.log(response);
        }).catch((err) => {
            if (err.response){
                if (err.response.status === 401) {
                    logoutAndRedirectAdminsUserToLoginPage();
                }
            }else {
                console.log(err.request);
            }
        });
    }
    const onChange = (value: string) => {
        console.log(value);
        setSelectedStoreId(value);
        onSelectStore(value);
        getAllUsersByStoreId(value);
    };


    const filterOption = (input: string, item: OptionType) => (item?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const { logoutAndRedirectAdminsUserToLoginPage } = LogoutService();
    const [storesList, setStoresList] = useState<OptionType[]>([]);
    const [storesOptionsList, setStoresOptionsList] = useState<OptionType[]>([]);
    useEffect(() => {
        getStoresForAdmin().then((response) => {
            setStoresList(response.storesResponse);
        }).catch((err) => {
            if (err.response){
                if (err.response.status === 401) {
                    logoutAndRedirectAdminsUserToLoginPage();
                }
            }else {
                console.log(err.request);
            }
        });
    }, []);
    useEffect(() => {
        const options: OptionType[] = [];
        storesList.forEach((store , index) => {
            const option: { label: string; value: string; key: any } = {
                key: store.id,
                label: (index+1)+"- " + store.name + (store.siren ? " ( "+ store.siren +" ) - " : " - " ) + store.city + " " + store.postal_code + (store.status=='2' ? ' ( Fermé )' : '') ,
                value: store.id,
            };
            options.push(option as OptionType);
        });
        setStoresOptionsList(options);
    }, [storesList]);


    return (
        <>
        <Row className={`${styles.centerElementRow} storeManageList `}>
            <Select
                className={`${styles.selectStoresOptions} dashboardStoresSelect`}
                showSearch
                placeholder="Veuillez choisir un magasin"
                optionFilterProp="children"
                onChange={onChange}
                filterOption={filterOption as any}
                options={storesOptionsList}
                notFoundContent={<div className={styles.selectNoResultFound}>
                    <p>Aucun magasin trouvé</p>
                    <p><MehOutlined /></p>
                </div>}
            />

        </Row>

        </>
    );
}

export default StoresList;
