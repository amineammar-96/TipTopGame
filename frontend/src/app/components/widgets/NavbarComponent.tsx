"use client";

import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


import styles from '../../../styles/components/navbar.module.css';

import {
  HomeOutlined,
  QuestionCircleOutlined,
  GiftOutlined,
  MailOutlined,
  PlayCircleOutlined,
  StarFilled,
  ExclamationCircleOutlined,
  UsergroupAddOutlined, DashboardOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';


function NavbarComponent() {
  return (
    <div>
       <Navbar expand="lg" className={`${styles.navbar}`}>
    <div className={styles.containerNavbar}>
      <Navbar.Brand className={`${styles.navbarBrand}`} href="#home">TheTeaHunt</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto d-flex justify-content-between w-100">
          <div className="d-flex">
          <Nav.Link href="#home" className={`${styles.navLink}`}><HomeOutlined className='mx-2' /> Accueil</Nav.Link>
          <Nav.Link href="#link" className={`${styles.navLink }`}><ExclamationCircleOutlined className='mx-2' />À propos</Nav.Link>
          <Nav.Link href="#link" className={`${styles.navLink}`}><GiftOutlined className='mx-2' />Historique des gains </Nav.Link>

          <Nav.Link href="#link" className={`${styles.navLink}`}><MailOutlined className='mx-2' />Contact</Nav.Link>
          <Nav.Link href="#link" className={`${styles.navLink}`}><QuestionCircleOutlined  className='mx-2' />FAQ</Nav.Link>

          </div>
          <div className={`${styles.rightDivNavBar}`}>
          <Nav.Link href="/store_login" className={`${styles.navLink} ${styles.navLinkStoreBtn}`}><DashboardOutlined /><span className='mx-2'>Espace Administrateurs</span></Nav.Link>
          <Nav.Link href="/client_login" className={`${styles.navLink} ${styles.navLinkPlayBtn}`}><PlayCircleOutlined  className='' /><span className='mx-2'>Participer</span></Nav.Link>

          </div>
         
        </Nav>
      </Navbar.Collapse>
    </div>
  </Navbar>
    </div>
  )

}

export default NavbarComponent