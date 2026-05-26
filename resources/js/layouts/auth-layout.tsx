import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

import MainLayout from '@/layouts/MainLayout';
import AuthCarousel from '@/pages/auth/registerComponents/AuthCarousel';


export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {

    return (
        <MainLayout className={''}>
        <div className="min-h-screen flex">
             <div className="hidden w-[400px] md:flex bg-gradient-to-b from-[#4946DD] to-[#701FC4] text-white justify-center items-center relative">
          <AuthCarousel />
        </div>
                {children}
        </div>
          </MainLayout>
    );
}
