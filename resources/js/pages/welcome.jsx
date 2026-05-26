
import { Head, Link, usePage } from '@inertiajs/react';
import { FaPaperPlane } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import Banner from './HomeComponents/Banner';
import WelcomeLayout from '@/layouts/welcome-layout'
import WhyUseOptivest from './HomeComponents/WhyUseOptivest';
import Workings from './HomeComponents/Workings';
import Testimonials from './HomeComponents/Testimonials';
import CallToAction from './HomeComponents/CallToAction';



export default function Welcome({celebrities}) {
    const { auth } = usePage().props;

    return (
        <WelcomeLayout>
            <Head title="Welcome" />
            <Banner/>
            <WhyUseOptivest/>
            <Workings/>
            <Testimonials/>
            <CallToAction/>
        </WelcomeLayout>
    );
}

