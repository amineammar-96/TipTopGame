
import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'antd';
import '../../app/globals.css'
import Dayjs from 'dayjs';
import 'dayjs/locale/fr';
import styles from '../../styles/pages/clientLoginPage.module.css';
import LoginClientForm from './components/LoginClientForm';
import RegisterClientForm from './components/RegisterClientForm';
import RedirectService from '../../app/service/RedirectService';
Dayjs.locale('fr');

export default function userLogin() {

  const { redirectAdminToToDashboard } = RedirectService();
  const [formStep, setFormStep] = useState(1);

    const handleFormStepChange = () => {
        setFormStep(formStep === 1 ? 2 : 1);
    };

  useEffect(() => {
      redirectAdminToToDashboard();
  }, [])



  return (
    <div>
      <Row className={`${styles.loginPageMainDiv}`}>
        {formStep == 1 ? (
          <>
            <Col className={`${styles.loginPageMainDivLeftSide} p-0 m-0`} xl={8} sm={0} md={6}>
              <img src="https://w.forfun.com/fetch/73/73f4ad6aa6336135d9891534eae06695.jpeg" alt="Landing Image" />
            </Col>
          </>

        ) : (
          <>
            <Col className={`${styles.loginPageMainDivLeftSide} p-0 m-0`} xl={7}  md={4} sm={0}>
              <img src="https://w.forfun.com/fetch/73/73f4ad6aa6336135d9891534eae06695.jpeg" alt="Landing Image" />
            </Col>

          </>
        )}


        {formStep == 1 ? (
          <>
            <Col className={`${styles.loginPageMainDivRightSide}`} xl={4}   md={6}  sm={12} >
              <LoginClientForm  formStep={formStep} handleFormStepChange={handleFormStepChange}></LoginClientForm>
            </Col>
          </>

        ) : (
          <>
            <Col className={`${styles.loginPageMainDivRightSide}`} xl={5}   md={8}  sm={12}>
              <RegisterClientForm formStep={formStep} handleFormStepChange={handleFormStepChange}></RegisterClientForm>
            </Col>

          </>
        )}
      </Row>
    </div>
  )
}

