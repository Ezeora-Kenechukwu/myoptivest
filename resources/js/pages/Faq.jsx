import React from 'react';
import WelcomeLayout from '@/layouts/welcome-layout';
import FaqsBanner from './FAQ\'s/FaqsBanner';
import FirstLayer from './FAQ\'s/FirstLayer';


const Faq = () => {
  return (
  <WelcomeLayout>
   <FaqsBanner  />
   <FirstLayer />
  </WelcomeLayout>
  )
}

export default Faq

