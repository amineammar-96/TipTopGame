"use client"
import React, {useState, useEffect} from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import RedirectService from '../../../app/service/RedirectService';

import {Button, Space} from 'antd';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import '../../../app/globals.css'
import {ArrowLeftOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';

import styles from '../../../styles/pages/adminsLoginPage.module.css';
import Icon, {
    LoginOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MailOutlined,
    AppstoreFilled,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
}
import {Checkbox, Form, Input} from 'antd';

type Props = {
    formStep: number;
    setFormStep: React.Dispatch<React.SetStateAction<number>>;
};

const userFormData = {
    email: '',
    password: "",
    remember: "",
};


import {loginAdmin} from '@/app/api';



export default function LoginAdminsForm() {
    const { redirectAdminToToDashboard } = RedirectService();

    useEffect(() => {
        redirectAdminToToDashboard();
    }, []);

    const [userForm, setUserForm] = useState(userFormData);



    const onFinish = (values: any) => {
        console.log('Form successfully sent');
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const validateMessages = {
        required: 'Ce champ est obligatoire !',
    };


    const userFormHandleChange = (e: React.ChangeEvent<HTMLInputElement>, ch: string) => {
        let inputValue = e.target.value;
        setUserForm((prevFormData) => ({
            ...prevFormData,
            [ch]: inputValue,
        }));
    }


    function login(formData: FieldType) {
        loginAdmin(formData).then((res) => {
            console.log("res : ", res);
            const loggedInUserToken = res.token;
            const loggedInUser = res.userJson;

            localStorage.setItem("loggedInUserToken",loggedInUserToken);
            localStorage.setItem("loggedInUserId" , loggedInUser.id);
            localStorage.setItem("loggedInUserEmail" , loggedInUser.email);
            localStorage.setItem("loggedInUserRole" , loggedInUser.role);
            localStorage.setItem("loggedInUser" , JSON.stringify(loggedInUser));

            redirectAdminToToDashboard();


        }).catch((err) => {
            console.log(err);
        });
    }


    return (
        <div className={`${styles.loginForm} mt-0 pt-0 `}>
            <Row className={`${styles.loginFormTopHeaderAux} p-0 m-0 pt-0`}>
                <Col>
                    <Row className={'justify-content-start'}>
                        <Col md={1}>
                            <a href="/">
                                <ArrowLeftOutlined/>
                            </a>
                        </Col>
                        <Col>
                            <h1>Connexion à votre compte</h1>
                        </Col>
                    </Row>
                </Col>

                <Col className={`d-flex justify-content-end`}>
                    <LoginOutlined className={`${styles.loginIcon}`}/>
                </Col>

            </Row>

            <Row md={6} className={'mt-5 justify-content-center'}>
                <Col md={4} className={'mt-5 justify-content-center'}>


                    <Row className={`${styles.loginLogo} p-0 m-0`}>
                        <a className={`${styles.loginLogo} p-0 m-0`} href="/"><img
                            src="https://app.liberrex.com/img/logo-horizontal.c69162fa.png" alt=""/></a>
                    </Row>

                    <Row className={`mt-5 px-5 d-flex justify-content-center `}>
                        <Form
                            name="basic"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 24}}
                            initialValues={{remember: +true}}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            validateMessages={validateMessages}
                            className={`${styles.loginForm}`}

                        >
                            <Form.Item<FieldType>
                                name="email"
                                rules={[{required: true, message: validateMessages['required']}]}
                                className={`${styles.antdLoginInputs}`}
                            >
                                <Input
                                    autoComplete="on"
                                    onChange={(e) => {
                                    userFormHandleChange(e, "email");
                                }} placeholder='E-mail' className={`${styles.inputsLoginPage}`}
                                       prefix={<UserOutlined className={`${styles.inputsLoginPageIcons}`}/>}/>
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="password"
                                rules={[{required: true, message: validateMessages['required']}]}
                                className={`${styles.antdLoginInputs}`}

                            >
                                <Input.Password
                                    onChange={(e) => {
                                        userFormHandleChange(e, "password");
                                    }}
                                    autoComplete="on"
                                    className={`${styles.inputsLoginPage}`}
                                    prefix={<LockOutlined className={`${styles.inputsLoginPageIcons}`}/>}
                                    placeholder='Mot de passe'
                                    iconRender={(visible) =>
                                        <div className={`${styles.eyePasswordIcon}`}>
                                            <span className={`${styles.eyePasswordIconRow}`}>{visible ?
                                                <EyeOutlined className={`${styles.inputsLoginPageIcons}`}/> :
                                                <EyeInvisibleOutlined
                                                    className={`${styles.inputsLoginPageIcons}`}/>}</span>
                                        </div>
                                    }

                                />
                            </Form.Item>

                            <Row>
                                <Col className={`m-0 py-2`}>
                                    <Form.Item<FieldType>
                                        name="remember"
                                        valuePropName="checked"
                                        className={`m-0 p-0`}
                                    >
                                        <Checkbox className={`${styles.sessionCkeckbox}`}> Garder ma session
                                            active</Checkbox>
                                    </Form.Item>
                                </Col>


                            </Row>

                            <Row>

                                <Col>
                                    <a href="#" className={`${styles.resetPasswordLink}`}>Mot de passe oublié
                                        ? <MailOutlined className={`${styles.resetPasswordIcon}`}/></a>
                                </Col>
                            </Row>

                            <Form.Item className={`py-3 w-100`}>
                                <Button onClick={() => {
                                    login(userForm);
                                }} className={`w-100 ${styles.loginBtnSubmit}`} type="primary" htmlType="submit">
                                    Se connecter
                                </Button>
                            </Form.Item>
                        </Form>
                    </Row>

                </Col>
            </Row>


            <div className="px-3 py-2 mt-5 pt-5">
                <Row className="px-3 py-2 mt-5 pt-5">
                    <Col className={`w-100 d-flex`}>
                        <Navbar expand="lg" className={`${styles.loginFooterLinksDiv}`}>
                            <div className={`${styles.containerLoginFooterLinks} d-flex `}>
                                <div className={`${styles.LoginLinksDiv} d-flex`}>
                                    <Nav className="me-auto d-flex justify-content-between w-100">
                                        <Nav.Link href="#home" className={`${styles.navLinkLogin}`}><AppstoreFilled
                                            className='mx-2'/> Termes et conditions</Nav.Link>
                                        <Nav.Link href="#link"
                                                  className={`${styles.navLinkLogin}`}><ExclamationCircleOutlined
                                            className='mx-2'/>Politique De Confidentialité</Nav.Link>
                                        <Nav.Link href="#link" className={`${styles.navLinkLogin}`}><MailOutlined
                                            className='mx-2'/>Contact</Nav.Link>
                                    </Nav>
                                </div>
                            </div>
                        </Navbar>
                    </Col>

                </Row>

                <Row>
                    <Col>
                        <div className={`${styles.navLinkLogin} d-flex`}>
                            <p>&copy; 2023 Furious Ducks. All rights reserved.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
