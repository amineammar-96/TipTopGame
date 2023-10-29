"use client";
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
    labels: ['Infuseur à thé', 'boite de 100g (thé détox ou infusion)', 'boite de 100g d’un thé signature', 'Coffret de 39€', 'Coffret de 69€'],
    datasets: [
        {
            label: 'Lots gagnés',
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
                '#42B2FF',
                '#E3E94B',
                '#7BC558',
                '#EBB3E6',
                '#FF5555',
            ],
            borderColor: [
                '#42B2FF',
                '#E3E94B',
                '#7BC558',
                '#EBB3E6',
                '#FF5555',
            ],
            borderWidth: 1,
        },
    ],
};

export function PrizesChartDoughunt() {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // @ts-ignore
    return <Doughnut className={styles.chartCircle} data={data} ref={inputRef} />;
}
