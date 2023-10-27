import React, {useEffect, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined, CheckOutlined,
    DownloadOutlined,
    LoginOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import styles from "@/styles/pages/favoriteStoreSelectionPage.module.css";
import "../../../../app/globalsSecond.css";
import "@/styles/pages/favoriteStoreSelectionPageGlobal.css";
import logoutService from "@/app/service/LogoutService";
import {Button, Modal, Radio} from 'antd';
import {associateClientToStore, getStoresForClient} from "@/app/api";
import {Pagination} from 'antd';

import welcomeImg from '@/assets/images/gifs/congratulations.gif';
import Image from 'next/image';

function FavoriteStoreSelectionPage() {
    const [loading, setLoading] = useState(false);
    const {logoutAndRedirectAdminsUserToLoginPage} = logoutService();
    const [storesList, setStoresList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [totalStoresCount, setTotalStoresCount] = useState(0);

    //radioKey
    const [checkedStore, setCheckedStore] = useState('');

    const selectStoreOption = (e: any) => {
        console.log('radio checked', e.target.value);
        setCheckedStore(e.target.value);
    }
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    function getAllStores() {
        getStoresForClient(currentPage, pageSize).then((response) => {
            setStoresList(response.storesResponse);
            setTotalStoresCount(response.totalStoresCount);
        }).catch((error) => {
            console.log(error);
            if (error.response) {
                if (error.response.status === 401) {
                    logoutAndRedirectAdminsUserToLoginPage();
                }
            }
        });
    }

    useEffect(() => {
        getAllStores();
    }, [currentPage]);

    useEffect(() => {
        const firstLoginClientStatus = localStorage.getItem('firstLoginClientStatus');
        if (firstLoginClientStatus == "false" || firstLoginClientStatus == "" || firstLoginClientStatus == null) {
            window.location.href = '/dashboard/client';
        }
    }, []);


    function confirmStoreChoice() {
        const data = {
            storeId: checkedStore,
        };

        if (checkedStore == '' || checkedStore == null) {
            Modal.error({
                className: 'modalError',
                title: 'Aucun magasin choisi !',
                content: 'Veuillez choisir un magasin pour continuer.',
                okText: "D'accord",
            });
            return;
        } else {
            associateClientToStore(data).then((response) => {
                if (response.status == "associated") {
                    Modal.success({
                        className: 'modalSuccess',
                        title: 'Votre choix a été enregistré avec succès !',
                        content: <>
                            <div className={`${styles.modalWithGifImage}`}>
                                <Image src={welcomeImg} alt={"Bienvenu"} className={`${styles.gifImage}`}/>
                                <p>Bienvenu dans notre aventure TipTop </p>
                                <p>Vous allez être redirigé vers votre tableau de bord.</p>
                            </div>
                        </>,
                        okText: "Continuer",
                        onOk() {
                            window.location.href = '/dashboard/client';
                            localStorage.removeItem('firstLoginClientStatus');
                        }
                    })
                    setTimeout(() => {
                        window.location.href = '/dashboard/client';
                        localStorage.removeItem('firstLoginClientStatus');
                    }, 5000);
                }
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        logoutAndRedirectAdminsUserToLoginPage();
                    } else {
                        Modal.error({
                            className: 'modalError',
                            title: 'Une erreur est survenue !',
                            content: 'Veuillez réessayer plus tard.',
                            okText: "D'accord",
                        });
                    }
                } else {
                    Modal.error({
                        className: 'modalError',
                        title: 'Une erreur est survenue !',
                        content: 'Veuillez réessayer plus tard.',
                        okText: "D'accord",
                    });
                }
            });
        }

    }

    return (
        <>
            {!loading && (
                <div>
                    <Row className={`${styles.storeSelectionPageTopHeader}`}>
                        <Col>
                            <Row className={`${styles.storeSelectionPageTopHeaderRow}`}>
                                <Col>
                                    <h1>
                                        Choix du magasin
                                    </h1>
                                </Col>
                            </Row>
                        </Col>

                        <Col className={`${styles.logoutDiv}`}>
                            <div onClick={logoutAndRedirectAdminsUserToLoginPage}>
                                <LogoutOutlined
                                                className={`${styles.logoutIcon}`}/>
                                <span className={`${styles.logoutSpan}`}> Se Déconnecter </span>
                            </div>
                        </Col>

                    </Row>
                    <Row className={`${styles.titlesRow}`}>
                        <Col className={`${styles.titlesCol}`}>
                            <div className={`${styles.topPageTitles}`}>
                                <h1>
                                    Merci de nous rejoindre ! C'est un honneur de vous avoir parmi nous.
                                </h1>
                                <h2>
                                    Sélectionnez votre magasin préféré pour commencer votre expérience avec nous.
                                </h2>
                            </div>
                        </Col>
                    </Row>
                    <Row className={`mt-0 pt-0`}>
                        <Col className={`${styles.antdGroupRadioBtnCol}`}>
                            <Radio.Group defaultValue={checkedStore} onChange={selectStoreOption} buttonStyle="solid">
                                {storesList.map((store: any, key: number) => (
                                    <Radio.Button disabled={store.status == "2"} value={store.id} key={key}>
                                        <div className={styles.radioBtnDiv}>
                                            <p><strong>Magasin : </strong>{store.name}</p>
                                            <p><strong>Adresse : </strong>{store.address}</p>
                                            <p>{store.postal_code} {store.city} {store.country}</p>
                                            <p><strong>E-mail : </strong>{store.email}</p>
                                            <p><strong>Téléphone : </strong>{store.phone}</p>
                                            {checkedStore == store.id && (
                                                <CheckOutlined className={`${styles.antdGroupRadioCheckedIcon}`}/>
                                            )}
                                        </div>
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row className={`mx-5 mt-4 justify-content-between`}>
                        <Col>
                            <Pagination defaultCurrent={currentPage} current={currentPage} onChange={handlePageChange}
                                        total={totalStoresCount} pageSize={pageSize}/>
                        </Col>
                        <Col className={`m-0 p-0`}>
                            <div className={`${styles.confirmStoreChoiceBtnDiv}`}>
                                <Button onClick={confirmStoreChoice} className={`${styles.confirmStoreChoiceBtn}`}
                                        type="primary" size="large">
                                    <div className={`${styles.confirmStoreChoiceBtnContent}`}>
                                        <span>Sélectionner ce magasin et continuer</span>
                                        <span>
                                <ArrowRightOutlined className={`${styles.confirmStoreChoiceBtnIcon}`}/>
                            </span>
                                    </div>
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    <Row className={`my-5`}></Row>
                </div>
            )}
        </>

    );
}

export default FavoriteStoreSelectionPage;