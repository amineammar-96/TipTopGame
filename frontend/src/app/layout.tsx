"use strict";
import './globals.css'
import { Inter } from 'next/font/google'
import './responsive.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TipTop-Game',
  description: 'Jeu de concours',
}

import Navbar from './components/widgets/NavbarComponent';
import Footer from './components/widgets/FooterComponent';
import CookiesModalComponent from './components/widgets/CookiesModalComponent';

import { GoogleAnalytics } from '@next/third-parties/google'
import {CheckOutlined, InfoCircleOutlined} from "@ant-design/icons";
import TopInfoBannerComponent from "@/app/components/widgets/TopInfoBannerComponent";
import TopGameInfoBannerComponent from "@/app/components/widgets/TopGameInfoBannerComponent";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {




  return (
    <html lang="en">
    <body className={inter.className}>
    <TopGameInfoBannerComponent></TopGameInfoBannerComponent>
    <Navbar></Navbar>
    {children}
    <Footer></Footer>
    <CookiesModalComponent></CookiesModalComponent>

    <TopInfoBannerComponent></TopInfoBannerComponent>

    </body>
    <GoogleAnalytics gaId="G-XLKV7N9HQT"/>
    </html>
  )
}
