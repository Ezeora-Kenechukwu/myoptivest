import React from 'react'
import Header from './welcome/Header'
import Footer from "./welcome/Footer";

import MainLayout from '@/layouts/MainLayout';
const WelcomeLayout = ({children}) => {
  return (
    <MainLayout className={''}>
    <div>
        {/* <Header /> */}
        <Header/>
{children}
        {/* <Footer /> */}
        <Footer/>
    </div>
      </MainLayout>
  )
}

export default WelcomeLayout
