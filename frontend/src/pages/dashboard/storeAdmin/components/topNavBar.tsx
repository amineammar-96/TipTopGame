import React, {useEffect, useState} from 'react';
import {LogoutOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import style from '@/styles/pages/dashboards/storeAdminDashboard.module.css';
import { Avatar, Space } from 'antd';
import RedirectService from "@/app/service/RedirectService";
import Image from "next/image";
import logoTeaImage from "@/assets/images/logoTea.png";


interface User {
    firstname: string;
    lastname: string;
    email: string;
}


function TopNavBar() {

    const { redirectAdminsUserToLoginPage } = RedirectService();
    const logout = () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUserId');
        localStorage.removeItem('loggedInUserRole');
        localStorage.removeItem('loggedInUserEmail');
        localStorage.removeItem('loggedInUserToken');

        redirectAdminsUserToLoginPage();

    }


    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        console.log("TopNavBar mounted");
        const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        setUser(user);
    }, []);

    let items: MenuProps['items'] = [
        {
            className: `${style.profileTopNavBarItem}`,
            label: <div className={style.unhoverableElement}>
                <Avatar className={style.unhoverableElement} src="https://images.prismic.io/utopix-next-website/Mzk0NGJkOWEtY2ZlYS00MjVjLTkwNTAtOGY5OWQzN2IzNGVi_762cec57-2eaf-4eaf-9a0d-2e7860147e48_profilhomme7.jpg?ixlib=js-3.8.0&w=3840&auto=format&fit=max" />
                { user && <span className={style.unhoverableElement}> {user.firstname} {user.lastname} </span>}
            </div>,
            key: 'avatar',
        },
        {
            label: <span onClick={logout} className={style.logoutSpan}>Déconnexion</span>,
            key: 'SubMenu',
            icon:  <LogoutOutlined className={style.logoutSpan} />,
            className: `${style.logoutTopNavBarItem}`
        },

    ];

    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        if (e.key === 'avatar') return;
        setCurrent(e.key);
    };

    return (
        <div className={style.topNavBarDiv}>
            <div className={`${style.logoDivSideBar}`}>
                <strong>TipTop</strong>
                <Image className={`${style.logoSideBar}`} alt={"LogoTipTop"} src={logoTeaImage} />
            </div>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        </div>
    );
}

export default TopNavBar;
