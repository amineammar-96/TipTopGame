"use client";
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);



export function PrizesStatsWithAgeChart() {

    const data = {
        labels: ['18-24 ans', '25-34 ans', '35-44 ans', '45+ ans'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5],
                backgroundColor: [
                    '#42B2FF',
                    '#E3E94B',
                    '#7BC558',
                    '#EBB3E6',
                ],
                borderColor: [
                    '#42B2FF',
                    '#E3E94B',
                    '#7BC558',
                    '#EBB3E6',
                ],
                borderWidth: 1,
            },
        ],
    };
    const inputRef = React.useRef<HTMLInputElement>(null);

    // @ts-ignore
    return <Pie className={`${styles.chartCircle} ${styles.chartCircleAge} `} data={data} />;
}
