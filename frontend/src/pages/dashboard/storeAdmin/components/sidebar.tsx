import React, {useEffect, useState} from 'react';
import {
    AppstoreOutlined,
    BarChartOutlined,
    BarcodeOutlined,
    BulbOutlined,
    CheckCircleOutlined,
    ClusterOutlined,
    ControlOutlined,
    DashboardOutlined,
    GiftOutlined,
    GoldOutlined,
    HistoryOutlined,
    LockOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    RadarChartOutlined,
    SettingOutlined,
    ShopOutlined,
    UserOutlined
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

    getItem('Statistiques des Participants', 'statisticsItem',<PieChartOutlined /> , [
    getItem('Participants Inscrits', 'statisticItemClients' , <BarChartOutlined />),
    getItem('Répartition des Gains', 'statisticItemPrizes' , <RadarChartOutlined />),
    ]),

    getItem('Gestion des magasins', 'storesItem', <AppstoreOutlined />, [
        getItem('Magasins', 'storesManagementItem' , <ShopOutlined />),
        getItem('Profils utilisateurs', 'profilesManagementItem' , <UserOutlined />),
    ]),
    getItem('Jeu-Concours', 'gameItem', <BulbOutlined />, [
        getItem('Tickets', 'ticketsItem' , <BarcodeOutlined />),
        getItem('Lots des gains', 'prizesLotsItem' , <ClusterOutlined />),
        getItem('Historiques des gains', 'historyPrizesItem' , <HistoryOutlined />),
    ]),

    getItem('Règlement du Jeu', 'gameConfigItem', <ControlOutlined />, [
        getItem('Dates du Jeu', 'datesConfigItem' , <CheckCircleOutlined />),
        getItem('Tirage au sort final', 'finalDrawItem' , <GoldOutlined />),
        getItem('Gestion des lots', 'lotsManagementItem' , <GiftOutlined />),
    ]),

    getItem('Paramètres', 'settingsItem', <SettingOutlined />, [
        getItem('Paramètres Généraux', 'generalSettingsItem' , <SettingOutlined />),
        getItem('Paramètres de Sécurité', 'securitySettingsItem' , <LockOutlined />),
        getItem('Modèles E-mails', 'emailManagementItem' , <MailOutlined />),
    ]),

];

// submenu keys of the first level
const rootSubmenuKeys = ['dashboardItem', 'statisticsItem', 'storesItem', 'gameItem', 'gameConfigItem', 'settingsItem'];
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
