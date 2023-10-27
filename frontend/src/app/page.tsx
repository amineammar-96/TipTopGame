"use client";
import styles from '../styles/page.module.css'
import React from "react";
import { useState, useEffect } from "react";
import { DatePicker } from 'antd';
import LandingPageTopSection from './components/landingpage/LandingPageTopSection';
import Dayjs from 'dayjs';
import 'dayjs/locale/fr';

Dayjs.locale('fr');

export default function Home() {


  
  
  return (
    <main className={styles.main}>
      <LandingPageTopSection></LandingPageTopSection>
    </main>
  )
}
