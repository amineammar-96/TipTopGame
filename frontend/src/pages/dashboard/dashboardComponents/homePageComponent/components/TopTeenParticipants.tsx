"use client";
import React from 'react';

import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";

import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

interface DataType {
    key: React.Key;
    name: string;
    chinese: number;
    math: number;
    english: number;
}
export function TopTeenParticipants() {


    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Chinese Score',
            dataIndex: 'chinese',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
                multiple: 3,
            },
        },
        {
            title: 'Math Score',
            dataIndex: 'math',
            sorter: {
                compare: (a, b) => a.math - b.math,
                multiple: 2,
            },
        },
        {
            title: 'English Score',
            dataIndex: 'english',
            sorter: {
                compare: (a, b) => a.english - b.english,
                multiple: 1,
            },
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: 'John Brown',
            chinese: 98,
            math: 60,
            english: 70,
        },
        {
            key: '2',
            name: 'Jim Green',
            chinese: 98,
            math: 66,
            english: 89,
        },
        {
            key: '3',
            name: 'Joe Black',
            chinese: 98,
            math: 90,
            english: 70,
        },
        {
            key: '4',
            name: 'Jim Red',
            chinese: 88,
            math: 99,
            english: 89,
        },
        {
            key: '5',
            name: 'Jake White',
            chinese: 98,
            math: 92,
            english: 87,
        },
        {
            key: '6',
            name: 'Jake White',
            chinese: 98,
            math: 92,
            english: 87,
        },
        {
            key: '7',
            name: 'Jake White',
            chinese: 98,
            math: 92,
            english: 87,
        },
        {
            key: '8',
            name: 'Jake White',
            chinese: 98,
            math: 92,
            english: 87,
        },
        {
            key: '9',
            name: 'Jake White',
            chinese: 98,
            math: 92,
            english: 87,
        },
        {
            key: '10',
            name: 'Jake White',
            chinese: 98,
            math: 92,
            english: 87,
        },
    ];

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return <div className={styles.tableStats}>
        <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>;
}


