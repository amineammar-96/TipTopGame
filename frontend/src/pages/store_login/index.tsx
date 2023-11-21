import React,{ useEffect} from 'react'
import {Col, Row} from "react-bootstrap";
import styles from "@/styles/pages/adminsLoginPage.module.css";
import LoginAdminstForm from "@/pages/store_login/components/StoreLoginForm";

export default function index() {



  return (
      <div>
        <Row className={`${styles.loginPageMainDiv} m-0`}>
              <>
                <Col className={`${styles.loginPageMainDivRightSide} pt-3`} md={12} >
                  <LoginAdminstForm></LoginAdminstForm>
                </Col>
              </>
        </Row>
      </div>
  )
}
