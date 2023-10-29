"use client";
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function PrizesStatsWithSexChart() {


    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: 'Analyse des lots par sexe',
            },
        },
    };

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

     const data = {
        labels,
        datasets: [
            {
                label: 'Hommes',
                data: labels.map(() => 34),
                borderColor: '#42B2FF',
                backgroundColor: '#42B2FF',
            },
            {
                label: 'Femmes',
                data: labels.map(() => 334),
                borderColor: '#EBB3E6',
                backgroundColor: '#EBB3E6',
            },
        ],
    };

    return <div className={styles.barChartDivSexStats}>
        <Bar options={options} data={data} />
    </div>;
}


