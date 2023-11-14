import React, { Component } from 'react'
import { Button } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../../../styles/components/landingpage/landingPgaTopSection.module.css';
import wallpaperHomepageImg from '@/assets/images/wallpaperHomepage.png';
import Image from 'next/image';

function LandingPageTopSection() {
    return (
        <div className={`mx-2 px-1 ${styles.topSection} mt-1`}>
            <Row className="mb-5 mt-5">
                <Col className={`${styles.topSectionLeftSide}`} md={6}>
                    <div className={`${styles.topSectionTextDiv}`}>
                        <h1>Bienvenue au Grand Jeu-Concours <span>  Thé Tip Top ! </span></h1>
                        <p>
                        Participez à notre extraordinaire Jeu-Concours et tentez votre chance de gagner des cadeaux exclusifs tout en découvrant nos délicieux thés bios et faits à la main. Scannez simplement le code unique de votre ticket de caisse pour entrer dans la course aux récompenses inoubliables !
                        </p>
                    </div>
                    <div className={`${styles.topSectionBtnsDiv}`}>
                        <Button className={`default-button-dark ${styles.playBtn} mt-2` } type="primary">Rejoignez l'aventure et Participez !</Button>
                    </div>
                </Col>
                <Col className={`${styles.topSectionRightSide}`} md={6}>
                    <Image src={wallpaperHomepageImg} alt={"tiptop"}>

                    </Image>
                </Col>
            </Row>
        </div>
    )
}

export default LandingPageTopSection
