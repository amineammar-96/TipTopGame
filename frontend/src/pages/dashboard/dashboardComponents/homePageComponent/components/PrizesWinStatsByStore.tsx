"use client";
import React from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);


export function PrizesWinStatsByStore() {

    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange','Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: 'Participants Gagnants',
                data: [12, 19, 3, 5, 2, 3,12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return <div className={`${styles.barChartDiv} mt-0`}>
        <PolarArea className={`${styles.barChartElement} mt-0`} data={data} />
    </div>;
}


