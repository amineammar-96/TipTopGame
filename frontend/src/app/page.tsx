"use client";
import styles from '../styles/page.module.css'
import React, {useEffect} from "react";
import { useState } from "react";
import { DatePicker } from 'antd';
import LandingPageTopSection from './components/landingpage/LandingPageTopSection';
import Dayjs from 'dayjs';
import 'dayjs/locale/fr';
import SpinnigLoader from "@/app/components/widgets/SpinnigLoader";

Dayjs.locale('fr');

export default function Home() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1300);
    }, []);
  
  return (
      <>
          {loading && (
              <>
                  <main className={styles.main}>
                  <SpinnigLoader></SpinnigLoader>
                    </main>
              </>
          )}
          {!loading && (
              <>
                  <main className={styles.main}>
                      <LandingPageTopSection></LandingPageTopSection>
                  </main>
              </>
          )}


      </>
  )
}
