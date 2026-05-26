import React from 'react'
import WelcomeLayout from '@/layouts/welcome-layout';
import CookieBanner from './CookiePolicy/CookieBanner';
import FirstLayer from './CookiePolicy/FirstLayer';
const CookiePolicy = () => {
  return (
    <WelcomeLayout>
     <CookieBanner />
     <FirstLayer />
     </WelcomeLayout>
  )
}

export default CookiePolicy;
