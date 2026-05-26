import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import MainLayout from '@/layouts/MainLayout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    return (
        <MainLayout className={''}>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        </MainLayout>
    );
};
