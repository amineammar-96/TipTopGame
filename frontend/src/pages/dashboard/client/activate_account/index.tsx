import React,{ useEffect} from 'react'
import {Col, Row} from "react-bootstrap";
import styles from "@/styles/pages/auth/adminsLoginPage.module.css";
import {checkActivationTokenValidityClient} from "@/app/api";
import {Modal} from "antd";

interface OptionType {
    token: string;
    email: string;
}

export default function index() {

    const [params, setParams] = React.useState<OptionType>({
        token: '',
        email: ''
    });


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        setParams({
            token: token ? token : '',
            email: email ? email : ''
        });
    }, []);


    function checkTokenValidity() {

        checkActivationTokenValidityClient(params).then((response) => {
                Modal.success({
                    title: 'Account activated',
                    content: 'Your account has been activated successfully',
                    onOk() {
                        //window.location.href = '/login';
                    }
                });
        }).catch((error) => {
            Modal.error({
                title: 'Error',
                content: 'Something went wrong',
                onOk() {
                    //window.location.href = '/login';
                }
            });
        })
    }

    useEffect(() => {
        if (params.token !== '' && params.email !== ''){
            checkTokenValidity();
        }
    }, [params]);


    return (
        <div>
            <Row className={`${styles.loginPageMainDiv} m-0`}>
                <>
                    <Col className={`${styles.loginPageMainDivRightSide} pt-3`} md={12} >



                    </Col>
                </>
            </Row>
        </div>
    )
}
