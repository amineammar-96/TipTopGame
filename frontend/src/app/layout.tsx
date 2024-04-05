"use strict";
import './globals.css'
import { Inter } from 'next/font/google'
import './responsive.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Jeu de concours - Thé Tiptop',
  description: 'Jeu de concours - Jeu de roulette pour gagner des cadeaux - Thé Tiptop - Marque de thé bio et équitable - Cadeaux à gagner',
}

import Navbar from './components/widgets/NavbarComponent';
import Footer from './components/widgets/FooterComponent';
import CookiesModalComponent from './components/widgets/CookiesModalComponent';

import { GoogleAnalytics } from '@next/third-parties/google'
import TopInfoBannerComponent from "@/app/components/widgets/TopInfoBannerComponent";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {




  return (
    <html lang="en">
    <body className={inter.className}>
    <TopInfoBannerComponent></TopInfoBannerComponent>

    <Navbar></Navbar>
    {children}
    <Footer></Footer>
    <CookiesModalComponent></CookiesModalComponent>


    </body>
    <GoogleAnalytics gaId="G-XLKV7N9HQT"/>
    </html>
  )
}
