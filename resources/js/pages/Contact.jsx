import React from 'react';
import WelcomeLayout from '@/layouts/welcome-layout'
import ContactBanner from './Contact/ContactBanner';
import FirstLayer from './Contact/FirstLayer';
import { Head } from '@inertiajs/react';

const Contact = () => {
  return (
    <WelcomeLayout>
    <Head title="Contact Us" />
    <ContactBanner />
    <FirstLayer />
    </WelcomeLayout>
  )
}

export default Contact
