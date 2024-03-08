"use client";
import React from 'react';
import { Row, Col } from 'antd';
import styles from '../../../styles/components/footer.module.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {
  SendOutlined,
} from '@ant-design/icons';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import {
  AppstoreFilled,
  QuestionCircleOutlined,
  ToolFilled,
  MailOutlined,
  PlayCircleOutlined,
  StarFilled,
  ExclamationCircleOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

const FooterComponent = () => {
  return (
    <div className={`${styles.footerContainer}`}>
      <Row className={`${styles.footerRow}`}>
        <Col className={`${styles.footerColumn} ${styles.footerNewsletterDiv}`} span={24}>
          <div>
            <h5 className='text-center mx-5 px-5'>
              RESTEZ À JOUR AVEC NOUS
              Si vous souhaitez vous tenir au courant de toutes nos actualités, communiqués et offres, veuillez vous abonner à notre newsletter et nous nous assurerons de vous livrer toutes nos actualités.
              </h5>
          </div>
          <div className={`pt-5 w-100 d-flex d-flex justify-content-center align-items-center`}>
            <InputGroup className="mb-3 d-flex justify-content-center align-items-center">
              <Form.Control
                placeholder="E-mail"
                aria-label="E-mail"
                aria-describedby="basic-addon2"
                className={`${styles.footerNewsletterInput} `}
              />
              <Button className={`${styles.footerSendBtn}`} variant="outline-secondary" id="button-addon2">
                S'abonner <SendOutlined className={`mx-2`} />
              </Button>
            </InputGroup>
          </div>

        </Col>
      </Row>
      <Row className="px-3 py-2">
        <Col className={`w-100 d-flex`} >
        <Navbar expand="lg" className={`${styles.footerLinksDiv}`}>
      <div className={`${styles.containerFooterLinks} d-flex `}>


        <div className={`${styles.linksDiv} d-flex`}>
        <p>&copy; {new Date().getFullYear()} Furious Ducks. Tous droits réservés.</p>
        </div>
      
      </div>
    </Navbar>
        </Col>
        
      </Row>
      {/* <Row className="copyright-row">
        <Col className={`d-flex justify-content-center py-5`} span={24}>
          <p>&copy; 2023 Your Company Name. All rights reserved.</p>
        </Col>
      </Row> */}
    </div>
  );
};

export default FooterComponent;
