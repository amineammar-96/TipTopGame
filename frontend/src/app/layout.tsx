import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TipTop-Game',
  description: 'Jeu de concours',
}

import Navbar from './components/widgets/NavbarComponent';
import Footer from './components/widgets/FooterComponent';

import { GoogleAnalytics } from '@next/third-parties/google'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar></Navbar>
        {children}  
        <Footer></Footer>
      </body>
        <GoogleAnalytics gaId="G-XLKV7N9HQT" />
    </html>
  )
}
