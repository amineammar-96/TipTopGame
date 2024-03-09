"use client";
import styles from '../../styles/page.module.css'
import React, {useEffect} from "react";
import { useState } from "react";
import { DatePicker } from 'antd';
import Dayjs from 'dayjs';
import 'dayjs/locale/fr';
import SpinnigLoader from "@/app/components/widgets/SpinnigLoader";
import {PhoneOutlined, MailOutlined, NodeIndexOutlined, SendOutlined} from "@ant-design/icons";

Dayjs.locale('fr');

export default function Info() {

    const [loading, setLoading] = useState(true);

    const [stepWindow, setStepWindow] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
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
                  <main className={`${styles.main} mt-5 pt-5`}>
                      <h1>
                            Page d'information
                      </h1>
                  </main>
              </>
          )}


      </>
  )
}
