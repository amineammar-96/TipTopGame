"use client";
import styles from '../../styles/page.module.css'
import React, {useEffect} from "react";
import { useState } from "react";
import { DatePicker } from 'antd';
import Dayjs from 'dayjs';
import 'dayjs/locale/fr';
import SpinnigLoader from "@/app/components/widgets/SpinnigLoader";

Dayjs.locale('fr');

export default function Contact() {

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
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <h1 className="text-center">
                                        Contactez-nous
                                    </h1>
                                </div>
                            </div>
                        </div>
                  </main>
              </>
          )}


      </>
  )
}
