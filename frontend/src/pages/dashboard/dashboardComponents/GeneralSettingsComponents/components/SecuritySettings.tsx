import React, {useRef, useState, useEffect} from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import LogoutService from "@/app/service/LogoutService";
import {Avatar, Button, Checkbox, Col, Divider, Form, Input, Row, Select, Tag} from "antd";
import {FastBackwardOutlined, SaveFilled} from "@ant-design/icons";
import {getUserPersonalInfo} from "@/app/api";
import AvatarUploader
    from "@/pages/dashboard/dashboardComponents/GeneralSettingsComponents/components/widgets/AvatarUploader";
import Image from "next/image";

interface OptionType {
    id: string;
    lastname: string;
    firstname: string;
    email: string;
    role: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    dateOfBirth: string;
    store: {
        id: string;
        name: string;
        address: string;
        city: string;
        postal_code: string;
        country: string;
        phone: string;
        email: string;
    };
}
function SecuritySettings() {


    const {logoutAndRedirectAdminsUserToLoginPage} = LogoutService();
    const [loading, setLoading] = useState(false);

    const [personalInfoForm, setPersonalInfoForm] = useState({
                    id: "",
                    lastname: "",
                    firstname: "",
                    email: "",
                    role: "",
                    phone: "",
                    address: "",
                    city: "",
                    postalCode: "",
                    country: "",
                    store: {
                        id: "",
                        name: "",
                        address: "",
                        city: "",
                        postal_code: "",
                        country: "",
                        phone: "",
                        email: "",
                    },
        });

    function getPersonalInfo() {
        let loggedInUserId = localStorage.getItem('loggedInUserId');
        if (loggedInUserId == null) {
            logoutAndRedirectAdminsUserToLoginPage();
        }else{
            getUserPersonalInfo(loggedInUserId).then((response) => {
                if (response) {
                    setPersonalInfoForm(response.user);
                }
            }).catch((error) => {
                console.log(error);
            })
        }

    }

    useEffect(() => {
        getPersonalInfo();

    }, []);

    useEffect(() => {
        console.log('personalInfoFormpersonalInfoFormpersonalInfoForm:', personalInfoForm);

    }, [personalInfoForm]);




    function updateProfileInfo(values: any) {
        console.log('values:', values);
    }

    const onFinish = (values: any) => {
        //setPersonalInfoForm(values);
        updateProfileInfo(values);
    }


    const reloadForm = () => {
        //setPersonalInfoForm(values);
    }

    return (
        <>

            <div  className={`mt-4 w-100 ${styles.templatesPersoDiv}`}>
                <h2 className={`display-6 my-5`}>
                    Paramètres de sécurité du compte
                </h2>

                <Row
                   className={`w-100`}
                >
                    <>
                        <Form
                            name="userInfo"
                            onFinish={onFinish}
                            layout="vertical"
                            key={personalInfoForm.id}
                            className={`w-100`}
                        >


                            <strong className={`my-5 d-flex justify-content-start`}>
                                Informations d'indentification
                            </strong>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item initialValue={personalInfoForm.email} label="Identifiant E-mail" name="id" required>
                                        <Input
                                            onChange={(e) => {
                                                setPersonalInfoForm({...personalInfoForm, email: e.target.value});
                                            }}
                                            placeholder="Entrez votre adresse e-mail"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12} className={`w-100 d-flex align-items-center justify-content-end `} >
                                    {personalInfoForm.role && (
                                        <>
                                            {personalInfoForm.role === 'ROLE_ADMIN' && (
                                                <Tag color="blue">Administrateur TipTop</Tag>
                                            )}

                                            {personalInfoForm.role === 'ROLE_STOREMANAGER' && (
                                                <Tag color="green">Manager de magasin</Tag>
                                            )}

                                            {personalInfoForm.role === 'ROLE_EMPLOYEE' && (
                                                <Tag color="orange">Employé de magasin ( caissier )
                                                </Tag>
                                            )}

                                            {personalInfoForm.role === 'ROLE_CLIENT' && (
                                                <Tag color="purple">Client - participant</Tag>
                                            )}

                                            {personalInfoForm.role === 'ROLE_ANONYMOUS' && (
                                                <Tag color="pink">
                                                    Client - non participant (Anonyme)
                                                </Tag>
                                            )}

                                        </>
                                    )}


                                </Col>
                            </Row>

                            <Divider />

                            <strong className={`my-5 d-flex justify-content-start`}>
                               Réinitialisation du mot de passe
                            </strong>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Mot de passe actuel" name="currentPassword" required>
                                        <Input.Password
                                            onChange={(e) => {
                                                setPersonalInfoForm({...personalInfoForm, email: e.target.value});
                                            }}
                                            placeholder="Entrez votre mot de passe actuel"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Nouveau mot de passe" name="newPassword" required>
                                        <Input.Password
                                            onChange={(e) => {
                                                setPersonalInfoForm({...personalInfoForm, email: e.target.value});
                                            }}
                                            placeholder="Entrez votre nouveau mot de passe"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label="Répetez le nouveau mot de passe" name="newPasswordConfirm" required>
                                        <Input.Password
                                            onChange={(e) => {
                                                setPersonalInfoForm({...personalInfoForm, email: e.target.value});
                                            }}
                                            placeholder="Entrez votre nouveau mot de passe"
                                        />
                                    </Form.Item>
                                </Col>

                            </Row>

                            <Row gutter={16} className={`d-flex justify-content-end`}>
                                <Col span={12} className={`d-flex justify-content-end`}>
                                    <Form.Item >
                                        <Button className={`mx-3 ${styles.cancelFormEmailTemplateBtn}`} type="default"
                                                onClick={() => {
                                                    reloadForm();
                                                }}
                                        >
                                            Annuler les modifications <FastBackwardOutlined />
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button className={`mx-3 ${styles.saveFormEmailTemplateBtn} saveFormEmailTemplateBtnGlobal`}  type="primary" htmlType="submit">
                                            Enregistrer <SaveFilled />
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>




                        </Form>
                    </>
                </Row>

            </div>

        </>
    );
}

export default SecuritySettings;