"use client";
import React from 'react';
import {
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function CityStatsChart() {

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Répartition des lots par ville',
            },
        },
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const labels = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'May'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: labels.map(() => 12),
                backgroundColor: '#42B2FF',
                stack: 'Stack 0',
            },
            {
                label: 'Dataset 2',
                data: labels.map(() => 4),
                backgroundColor: '#FF5555',
                stack: 'Stack 2',
            },
            {
                label: 'Dataset 3',
                data: labels.map(() => 7),
                backgroundColor: '#EBB3E6',
                stack: 'Stack 1',
            },
        ],
    };

    return <div className={styles.barChartDiv}>
        <Bar className={styles.barChartElement} options={options} data={data}/>
    </div>;
}


