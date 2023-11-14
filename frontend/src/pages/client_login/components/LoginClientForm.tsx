"use client"
import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { signIn } from 'next-auth/react';
import FacebookLogin from 'react-facebook-login';
import Image from 'next/image';
import logoTipTopImg from "@/assets/images/tipTopLogoAux.png";

import {Button, Modal, Space} from 'antd';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import '../../../app/globals.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import styles from '../../../styles/pages/clientLoginPage.module.css';
import Icon, {
    LoginOutlined,
    FacebookFilled,
    TwitterSquareFilled,
    GoogleSquareFilled,
    EyeOutlined,
    EyeInvisibleOutlined,
    MailOutlined,
    AppstoreFilled,
    UserAddOutlined,
    ToolFilled,
    PlayCircleOutlined,
    StarFilled,
    ExclamationCircleOutlined,
    UsergroupAddOutlined,

} from '@ant-design/icons';
type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
}
import { Checkbox, Form, Input } from 'antd';

type Props = {
    formStep: number;
    handleFormStepChange: () => void;
};

const userFormData = {

    email: '',
    password: "",
    remember: "",

};



import {facebookCallBack, loginClient} from '@/app/api';




export default function LoginClientForm({ formStep, handleFormStepChange }: Props) {

    const [userForm, setUserForm] = useState(userFormData);
    const [loginError, setLoginError] = useState<string | null>(null);



    const onFinish = (values: any) => {
        console.log('Success:', values);
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

    const handleClientLogin = async () => {
        if (userForm.email && userForm.password) {

            loginClient(userForm).then((response) => {
                console.log(response);
                if (response.status === 'success') {
                    const loggedInUser = response.userJson;
                    localStorage.setItem('loggedInUserToken', response.token);
                    localStorage.setItem('firstLoginClientStatus', response.firstLogin);
                    localStorage.setItem("loggedInUserId", loggedInUser.id);
                    localStorage.setItem("loggedInUserEmail", loggedInUser.email);
                    localStorage.setItem("loggedInUserRole", loggedInUser.role);
                    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
                    window.location.href = '/dashboard/client';
                }
            }).catch((err) => {
                setLoginError('Email ou mot de passe incorrecte !');
                Modal.error({
                    className: 'antdLoginRegisterModal',
                    title: 'Email ou mot de passe incorrecte !',
                    content: <>
                    <span>
                        Veuillez vérifier votre email et mot de passe et réessayer.
                    </span>
                    </>,
                    okText: "D'accord",
                });
            })
        }
    }



    const facebookCallBackHandle = () => {
        facebookCallBack().then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        })
    }
    const googleCallBackHandle = () => {

    }


    const responseFacebook = async (response : any ) => {
        if (response.id) {
            // Facebook login was successful
            await signIn('facebook', { accessToken: response.accessToken });
        } else {
            // Facebook login failed
            console.log('Facebook login failed');
        }
    };



    return (
        <div className={`${styles.loginForm} `}>
            <Row className={`${styles.loginFormTopHeader} p-0 m-0`}>
                <Col>
                    <h1>Connexion à votre compte</h1>
                </Col>

                <Col className={`d-flex justify-content-end`}>
                    <LoginOutlined className={`${styles.loginIcon}`} />

                </Col>

            </Row>
            <Row className={`${styles.loginLogo} p-0 m-0`}>
                <a className={`${styles.loginLogo} p-0 m-0`} href="/">
                    <Image
                        src={logoTipTopImg}
                        alt="Picture of the author"
                    >

                    </Image>
                </a>

            </Row>

            <Row className={`mt-5 px-5 d-flex justify-content-center `}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 24 }}
                    initialValues={{ remember: +true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    validateMessages={validateMessages}
                    className={`${styles.loginForm}`}

                >
                    <Form.Item<FieldType>
                        name="email"
                        rules={[{ required: true, message: validateMessages['required'] }]}
                        className={`${styles.antdLoginInputs}`}
                        validateStatus={loginError ? "error" : "success"}
                        hasFeedback

                    >
                        <Input

                            onChange={(e) => {
                            userFormHandleChange(e, "email");
                        }} placeholder='E-mail' className={`${styles.inputsLoginPage}`} prefix={<UserOutlined className={`${styles.inputsLoginPageIcons}`} />} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="password"
                        rules={[{ required: true, message: validateMessages['required'] }]}
                        className={`${styles.antdLoginInputs}`}
                        validateStatus={loginError ? "error" : "success"}
                        help={loginError}
                        hasFeedback
                    >
                        <Input.Password
                            onChange={(e) => {
                                userFormHandleChange(e, "password");
                            }}
                            className={`${styles.inputsLoginPage}`} prefix={<LockOutlined className={`${styles.inputsLoginPageIcons}`} />}
                            placeholder='Mot de passe'
                            iconRender={(visible) =>
                                <div className={`${styles.eyePasswordIcon}`}>
                                    <span className={`${styles.eyePasswordIconRow}`} >{visible ? <EyeOutlined className={`${styles.inputsLoginPageIcons}`} /> : <EyeInvisibleOutlined className={`${styles.inputsLoginPageIcons}`} />}</span>
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
                                <Checkbox className={`${styles.sessionCkeckbox}`}>  Garder ma session active</Checkbox>
                            </Form.Item>
                        </Col>


                    </Row>

                    <Row>

                        <Col>
                            <a href="#" className={`${styles.resetPasswordLink}`} >Mot de passe oublié ? <MailOutlined className={`${styles.resetPasswordIcon}`} /></a>
                        </Col>
                    </Row>

                    <Form.Item className={`py-3 w-100`}>
                        <Button onClick={() => {
                            handleClientLogin();
                        }}  className={`w-100 ${styles.loginBtnSubmit}`} type="primary" htmlType="submit">
                            Se connecter
                        </Button>
                    </Form.Item>
                </Form>

                <Row>

                    <Col>
                        <a href="#" onClick={() => {
                            handleFormStepChange();
                        }} className={`${styles.resetPasswordLink}`} ><UserAddOutlined className={`${styles.resetPasswordIcon}`} /> Rejoignez-nous et gagnez en créant un compte !</a>
                    </Col>
                </Row>

                <Col>
                    <Row>
                        <div className={`${styles.divider}`}>
                            <div className={`${styles['divider-text']}`}>Ou</div>
                        </div>
                        <div className={`pt-3`}>
                            <p className={`text-center`}>
                                Connectez-vous avec vos réseaux sociaux préférés.
                            </p>
                        </div>
                        <div className={`py-3`}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                               {/* <FacebookLogin
                                    appId={"621713663395181"}
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    callback={responseFacebook}
                                />*/}
                                <Button onClick={() => {
                                    facebookCallBackHandle();
                                }} className={`${styles.facebookLoginBtn}`} icon={<FacebookFilled />} block>
                                    <span> <small>Se coonecter avec Facebook</small></span>
                                </Button>

                                <Button onClick={() => {
                                    googleCallBackHandle();
                                }} className={`${styles.googleLoginBtn}`} icon={<GoogleSquareFilled />} block>
                                    <span><small>Se coonecter avec Google</small></span>
                                </Button>
                            </Space>
                        </div>
                    </Row>
                </Col>
            </Row>

            <Row className="px-3 py-2 mt-5 pt-4">
                <Col className={`w-100 d-flex`} >
                    <Navbar expand="lg" className={`${styles.loginFooterLinksDiv}`}>
                        <div className={`${styles.containerLoginFooterLinks} d-flex `}>
                            <div className={`${styles.LoginLinksDiv} d-flex`}>
                                    <Nav className="me-auto d-flex justify-content-between w-100">
                                        <Nav.Link href="#home" className={`${styles.navLinkLogin}`}><AppstoreFilled className='mx-2' /> Termes et conditions</Nav.Link>
                                        <Nav.Link href="#link" className={`${styles.navLinkLogin}`}><ExclamationCircleOutlined className='mx-2' />Politique De Confidentialité</Nav.Link>
                                        <Nav.Link href="#link" className={`${styles.navLinkLogin}`}><MailOutlined className='mx-2' />Contact</Nav.Link>
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
    )
}
