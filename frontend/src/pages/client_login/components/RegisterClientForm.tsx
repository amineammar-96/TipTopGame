import React, {useState} from 'react'
import {Container, Row, Col} from 'react-bootstrap';

import {Button, Space} from 'antd';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import '../../../app/globals.css'
import {ArrowLeftOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';
import {DatePicker, ConfigProvider} from 'antd';

import type {DatePickerProps} from 'antd';
import 'dayjs/locale/fr';
import locale from 'antd/locale/fr_FR';


import styles from '../../../styles/pages/clientRegisterPage.module.css';
import{
    FacebookFilled,
    GoogleSquareFilled,
    EyeOutlined,
    EyeInvisibleOutlined,
    MailOutlined,
    UserAddOutlined,
    PhoneOutlined,

} from '@ant-design/icons';

type registerUserForm = {
    email?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    gender?: string;
    phone?: string;
    passwordConfirm?: string;
    dateOfBirth?: string;
}

const userFormData = {
    firstname: '',
    lastname: '',
    email: '',
    dateOfBirth: "",
    password: "",
    phone: '',
    passwordConfirm: "",
    gender: "",
    role: "ROLE_CLIENT",
};

import {Checkbox, Form, Input} from 'antd';
import {Select} from 'antd';
import {useEffect} from 'react';

const {Option} = Select;


type Props = {
    formStep: number;
    handleFormStepChange: () => void;
};

const dateFormat = 'DD/MM/YYYY';

const {RangePicker} = DatePicker;

import {register} from '@/app/api';
import { Modal } from 'antd';
import Image from "next/image";
import logoTipTopImg from "@/assets/images/tipTopLogoAux.png";

export default function RegisterClientForm({formStep, handleFormStepChange}: Props) {


    const [formRef] = Form.useForm();
    const [userForm, setUserForm] = useState(userFormData);



    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const validateMessages = {
        required: 'Ce champ est obligatoire !',
    };


    const handleDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        if (dateString && date) {
            console.log(date.format('DD/MM/YYYY'));
            let ch = date.format('DD/MM/YYYY');
            setUserForm((prevFormData) => ({
                ...prevFormData,
                dateOfBirth: ch,
            }));
        }
    };


    const userFormHandleChange = (e: React.ChangeEvent<HTMLInputElement>, ch: string) => {
        let inputValue = e.target.value;
        setUserForm((prevFormData) => ({
            ...prevFormData,
            [ch]: inputValue,
        }));
    }

    const userGenderFormHandleChange = (value: any) => {
        setUserForm((prevFormData) => ({
            ...prevFormData,
            gender: value,
        }));
    }


    const [emailExists, setEmailExists] = useState(false);

    const [passwordErrorExists, setPasswordErrorExists] = useState(false);
    function registerClient() {
        if (userForm.firstname == "") {
            console.log("firstname is empty");
            return;
        }
        if (userForm.lastname == "") {
            console.log("lastname is empty");
            return;
        }
        if (userForm.email == "") {
            console.log("email is empty");
            return;
        }
        if (userForm.dateOfBirth == "") {
            console.log("dateOfBirth is empty");
            return;
        }
        if (userForm.phone == "") {
            console.log("phone is empty");
            return;
        }

        if (userForm.gender == "") {
            console.log("gender is empty");
            return;
        }
        if (userForm.password == "" || userForm.passwordConfirm == "") {
            console.log("password is empty");
            return;
        }

        if (userForm.password !== userForm.passwordConfirm ) {
            setPasswordErrorExists(true)
            console.log("password not match");
            Modal.error({
                className: 'antdLoginRegisterModal',
                title: 'Mot de passe non identique !',
                content: <>
                    <span> Veuillez vérifier les mots de passe saisis. </span>
                </>,
                okText: "D'accord",
            });
            return;
        }else {
            setPasswordErrorExists(false)
        }

        register(userForm).then((response) => {
            console.log(response.status);
            if (response.status === "success") {
                setEmailExists(false);
                formRef.resetFields();
                Modal.success({
                    className: 'modalSuccess antdLoginRegisterModal',
                    title : 'Inscription réussie !',
                    content: <>
                        <strong>Vous êtes inscrit avec succès.</strong> <br/>
                        <span>Vous pouvez maintenant vous connecter.</span>
                    </>,
                    okText: "Se connecter",
                    onOk() {
                        handleFormStepChange();
                    }
                });
            }
        }).catch((err) => {
            console.log(err);
            if (err.response) {
                if (err.response.status === 400) {
                    console.log(err.response.data.error);
                    if(err.response.data.error == "Email already registered"){
                        setEmailExists(true);
                        Modal.error({
                            className: 'antdLoginRegisterModal',
                            title: 'Un problème est survenu !',
                            content: <>
                                <span>Un compte avec cet email existe déjà.</span> <br/>
                                <span>Si vous n'avez pas de compte, veuillez vous inscrire avec un autre email.</span>
                            </>,
                            okText: "D'accord",
                        });
                    }
                }else{
                    Modal.error({
                        className: 'antdLoginRegisterModal',
                        title: 'Un problème est survenu !',
                        content: <>
                            <span>Un problème est survenu lors de l'inscription.</span> <br/>
                            <span>Veuillez réessayer plus tard.</span>
                        </>,
                        okText: "D'accord",
                    });
                }
            } else {
                console.log(err.request);
            }
        })
    }

    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className={`${styles.loginForm} `}>
            <Row className={`${styles.loginFormTopHeader} p-0 m-0`}>
                <Col md={1}>
                    <a href="/">
                        <ArrowLeftOutlined className={`${styles.leftArrowIcon}`}/>
                    </a>
                </Col>
                <Col>
                    <h1>Inscrivez-vous</h1>
                </Col>

                <Col className={`d-flex justify-content-end`} style={{maxWidth: '5rem'}}>
                    <UserAddOutlined className={`${styles.loginIcon}`}/>
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
                    labelCol={{span: 8}}
                    wrapperCol={{span: 24}}
                    initialValues={{remember: +true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    validateMessages={validateMessages}
                    className={`${styles.registerForm}`}
                >
                    <Space.Compact>
                        <Form.Item<registerUserForm>
                            name="lastname"
                            rules={[{required: true, message: validateMessages['required']}]}
                            className={`${styles.antdLoginInputs}`}
                        >
                            <Input onChange={(e) => {
                                userFormHandleChange(e, "lastname");
                            }}
                                   placeholder='Nom' className={`${styles.inputsLoginPage}`}
                                   prefix={<UserOutlined className={`${styles.inputsLoginPageIcons}`}/>}/>
                        </Form.Item>
                        <Form.Item<registerUserForm>
                            name="firstname"
                            rules={[{required: true, message: validateMessages['required']}]}
                            className={`${styles.antdLoginInputs}`}
                        >
                            <Input onChange={(e) => {
                                userFormHandleChange(e, "firstname");
                            }} placeholder='Prénom' className={`${styles.inputsLoginPage}`}
                                   prefix={<UserOutlined className={`${styles.inputsLoginPageIcons}`}/>}/>
                        </Form.Item>
                    </Space.Compact>


                        <Space.Compact>
                            <Form.Item<registerUserForm>
                                name="email"
                                rules={[{required: true, message: validateMessages['required']}]}
                                className={`${styles.antdLoginInputs}`}
                                validateStatus={emailExists ? 'error' : ''}
                            >
                                <Input onChange={(e) => {
                                    userFormHandleChange(e, "email");
                                }} placeholder='E-mail' type='email' className={`${styles.inputsLoginPage}`}
                                       prefix={<MailOutlined className={`${styles.inputsLoginPageIcons}`}/>}/>
                            </Form.Item>

                            <Form.Item<registerUserForm>
                                name="dateOfBirth"
                                rules={[{
                                    required: userForm.dateOfBirth == "",
                                    message: 'La date de naissance est requise.'
                                }]}
                            >
                                <ConfigProvider locale={locale}>
                                    <DatePicker
                                        onChange={handleDateChange}
                                        format={dateFormat}
                                        className={`${styles.inputsLoginPage}`} renderExtraFooter={() =>
                                        <>
                                            <span className='mx-4'>Date de naissance</span>
                                        </>
                                    }
                                        placeholder='Date de naissance'
                                    />
                                </ConfigProvider>
                            </Form.Item>
                        </Space.Compact>



                    <Space.Compact>
                        <Form.Item<registerUserForm>
                            name="phone"
                            rules={[{required: true, message: validateMessages['required']}]}
                            className={`${styles.antdLoginInputs}`}
                        >
                            <Input
                                onChange={(e) => {
                                    userFormHandleChange(e, "phone");
                                }}
                                placeholder='Numéro de téléphone' className={`${styles.inputsLoginPage}`}
                                prefix={<PhoneOutlined className={`${styles.inputsLoginPageIcons}`}/>}/>
                        </Form.Item>
                        <Form.Item<registerUserForm>
                            name="gender"
                            rules={[{required: true, message: validateMessages['required']}]}
                            className={`${styles.antdLoginInputs}`}
                        >
                            <Select onChange={(value) => {
                                userGenderFormHandleChange(value);
                            }}
                                    placeholder="Sélectionnez votre genre" className={`${styles.inputsLoginPage}`}>
                                <Option value="Homme">Homme</Option>
                                <Option value="Femme">Femme</Option>
                                <Option value="Autre">Autre</Option>
                            </Select>
                        </Form.Item>
                    </Space.Compact>


                    <Space.Compact>
                        <Form.Item<registerUserForm>
                            name="password"
                            rules={[{required: true, message: validateMessages['required']}]}
                            className={`${styles.antdLoginInputs}`}
                            validateStatus={passwordErrorExists ? 'error' : ''}
                        >
                            <Input onChange={(e) => {
                                userFormHandleChange(e, "password");
                            }} className={`${styles.inputsLoginPage}`}
                                            prefix={<LockOutlined className={`${styles.inputsLoginPageIcons}`}/>}
                                            placeholder='Mot de passe'
                                            suffix={
                                                <div className={`${styles.eyePasswordIcon}`}>
                                                    <span className={`${styles.eyePasswordIconRow}`}>{passwordVisible ?
                                                        <EyeOutlined onClick={togglePasswordVisibility} className={`${styles.inputsLoginPageIcons}`}/> :
                                                        <EyeInvisibleOutlined onClick={togglePasswordVisibility}
                                                                              className={`${styles.inputsLoginPageIcons}`}/>}</span>
                                                </div>
                                            }
                                   type={passwordVisible ? 'text' : 'password'}

                            />
                        </Form.Item>
                        <Form.Item<registerUserForm>
                            name="passwordConfirm"
                            rules={[{required: true, message: validateMessages['required']}]}
                            className={`${styles.antdLoginInputs}`}
                            validateStatus={passwordErrorExists ? 'error' : ''}
                        >

                            <Input onChange={(e) => {
                                userFormHandleChange(e, "passwordConfirm");
                            }} className={`${styles.inputsLoginPage}`}
                                            prefix={<LockOutlined className={`${styles.inputsLoginPageIcons}`}/>}
                                            placeholder='Répétez le mot de passe'
                                            type={passwordVisible ? 'text' : 'password'}
                                   suffix={
                                       <div className={`${styles.eyePasswordIcon}`}>
                                                    <span className={`${styles.eyePasswordIconRow}`}>{passwordVisible ?
                                                        <EyeOutlined onClick={togglePasswordVisibility} className={`${styles.inputsLoginPageIcons}`}/> :
                                                        <EyeInvisibleOutlined onClick={togglePasswordVisibility}
                                                                              className={`${styles.inputsLoginPageIcons}`}/>}</span>
                                       </div>
                                   }


                            />
                        </Form.Item>
                    </Space.Compact>
                    <Form.Item className={`pt-3`}>
                        <Button
                            onClick={() => {
                                registerClient();
                            }}
                            className={`w-100 ${styles.loginBtnSubmit}`} type="primary" htmlType="submit">
                            Valider l'inscription
                        </Button>
                    </Form.Item>
                </Form>

                <Row>

                    <Col>
                        <a href="#" onClick={() => {
                            handleFormStepChange();
                        }} className={`${styles.resetPasswordLink}`}><UserAddOutlined
                            className={`${styles.resetPasswordIcon}`}/> Connectez-vous et gagnez en créant un compte
                            !</a>
                    </Col>
                </Row>

                <Col>
                    <Row className={`mt-3 px-5 d-flex justify-content-center `}>
                        <div className={`${styles.divider}`}>
                            <div className={`${styles['divider-text']}`}>Ou</div>
                        </div>
                        <div className={`pt-3`}>
                            <p className={`text-center`}>
                                Connectez-vous avec vos réseaux sociaux préférés.
                            </p>
                        </div>


                        <div className={`pb-3  d-flex justify-content-center `}>
                            <Space direction="vertical" style={{width: '100%'}}
                                   className={`pb-3  d-flex justify-content-center `}>
                                <Button className={`${styles.facebookLoginBtn}`} icon={<FacebookFilled/>} block>
                                    <span> <small>Inscrivez-vous avec Facebook</small></span>
                                </Button>
                                <Button className={`${styles.googleLoginBtn}`} icon={<GoogleSquareFilled/>} block>
                                    <span><small>Inscrivez-vous avec Google</small></span>
                                </Button>
                            </Space>
                        </div>
                    </Row>
                </Col>
            </Row>

            {/*<Row className="px-3 py-2">
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

            </Row>*/}

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
