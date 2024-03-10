import React, {useEffect, useState} from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import {Button, Col, Divider, Form, Input, Row, Tag} from "antd";


function TirageAuSortTemplate() {



        return (
        <div className={styles.homePageContent}>

            <div className={`${styles.homePageContentTopHeader}`}>
                <h1 className={`mx-3`}>
                    Tirage au sort final
                </h1>
                <div className={`${styles.ticketsCardsMain} mt-5`}>
                    <div className={`${styles.ticketsCardsDiv} ${styles.correspandancesDiv} mb-5 px-4`}>
                        <div className={` w-100 ${styles.templatesPersoDiv}`}>
                            <h5 className={"mt-5"}>
                                Veuillez procéder au tirage au sort final
                            </h5>

                            <ul>
                                <li>
                                    <span>
                                        Nombre de clients participants : 100
                                    </span>
                                </li>

                            </ul>

                            <Divider/>



                        </div>

                    </div>

                </div>
            </div>


        </div>
        );
}

export default TirageAuSortTemplate;