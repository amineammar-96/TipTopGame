import React, {useEffect, useState} from 'react';
import {
    BulbOutlined,
    ClusterOutlined,
    DashboardOutlined, GiftOutlined,
    HistoryOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined, PlayCircleOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';
import {Button, Col, Menu, Row} from 'antd';
import style from '@/styles/pages/dashboards/storeAdminDashboard.module.css';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Tableau de bord', 'dashboardItem', <DashboardOutlined />),
    getItem('Testez Votre Chance', 'playGameItem', <PlayCircleOutlined />),
    getItem('Jeu-Concours', 'gameItem', <BulbOutlined />, [
        getItem('Lots des gains', 'prizesLotsItem' , <GiftOutlined />),
        getItem('Historiques des gains', 'historyPrizesItem' , <HistoryOutlined />),
    ]),
    getItem('Statistiques des gain', 'statisticsItem',<PieChartOutlined /> ),
    getItem('Paramètres du compte', 'settingsItem', <SettingOutlined />),

];

// submenu keys of the first level
const rootSubmenuKeys = ['dashboardItem', 'playGameItem', 'gameItem', 'statisticsItem', 'settingsItem'];
interface SidebarProps {
    onMenuItemClick: (menuItemKey: string) => void;
    selectedMenuItem: string;
    toggleCollapsed: () => void;
    collapsed: boolean;
}
function Sidebar({ onMenuItemClick, selectedMenuItem , toggleCollapsed , collapsed }: SidebarProps) {
    // Specify the type for openKeys
    const [openKeys, setOpenKeys] = useState<string[]>([]);



    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys([]);
            setOpenKeys(keys);
        } else {
            setOpenKeys([]);
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };





    return (
        <div className={style.sideBarDiv}>
            <Row className={style.toggleBtnDiv}>

                    <Button className={style.collapseBtn} onClick={toggleCollapsed}>
                        {collapsed ? <MenuUnfoldOutlined className={style.collapseBtnIcon} /> : <MenuFoldOutlined className={style.collapseBtnIcon} />}
                    </Button>
            </Row>
        <Menu
            key={selectedMenuItem}
            className={`${style.sideBarMenu} sideBarMenuDashboards`}
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            inlineCollapsed={collapsed}
            items={items}
            defaultSelectedKeys={[`${selectedMenuItem}`]}
            onClick={({ key }) => onMenuItemClick(key)}
        />
        </div>
    );
}

export default Sidebar;
