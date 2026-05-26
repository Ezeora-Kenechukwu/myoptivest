import React from 'react'
import WelcomeLayout from '@/layouts/welcome-layout';
import PrivacyBanner from './Privacy/PrivacyBanner';
import FirstLayer from './Privacy/FirstLayer';


const Privacy = () => {
  return (
    <WelcomeLayout>
    <PrivacyBanner />
    <FirstLayer />
     </WelcomeLayout>
  )
}

export default Privacy
