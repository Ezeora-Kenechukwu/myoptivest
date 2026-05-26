import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    AlertTriangleIcon,
    Award,
    Banknote,
    BarChartHorizontalIcon,
    BookOpen,
    BookOpenCheck,
    BoomBox,
    Folder,
    HelpCircle,
    Hospital,
    LayoutGrid,
    TriangleDashedIcon,
    UserCog,
    UserRoundPen,
    UserSearch,
} from 'lucide-react';
import AppLogo from './app-logo';
// 'can_create', 'can_edit', 'can_view', 'can_delete', 'can_forceDelete', 'can_index',
//                                 'can_store', 'can_approve', 'can_restore', 'can_indexTrash', 'can_viewTrash',
//                                 'can_assign', 'can_update', 'can_join', 'can_pin', 'can_share', 'can_copy',
//                                 'can_download', 'can_preview', 'can_upload'
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        permission: 'Dashboard',
    },
    {
        title: 'Permission Manager',
        href: '/permissions',
        icon: BookOpen,
        permission: 'Permission',
    },
    {
        title: 'Role Manager',
        href: '/roles',
        icon: Folder,
        permission: 'Role',
    },
    {
        title: 'Admin Manager',
        href: '/admins',
        icon: UserRoundPen,
        permission: 'Admin Manager',
    },
    {
        title: 'Editor Manager',
        href: '/editors',
        icon: UserSearch,
        permission: 'Editor Manager',
    },
    {
        title: 'User Manager',
        href: '/users',
        icon: UserCog,
        permission: 'User Management',
    },
    {
        title: 'Plan Category Manager',
        href: '/investment-plan-categories',
        icon: Banknote,
        permission: 'InvestmentPlanCategory',
    },
    {
        title: 'Investment Plan Manager',
        href: '/investment-plans',
        icon: TriangleDashedIcon,
        permission: 'InvestmentPlan',
    },
    {
        title: 'Savings Plan Manager',
        href: '/savings-plans',
        icon: Award,
        permission: 'SavingsPlan',
    },
    {
        title: 'Savings Manager',
        href: '/admin/savings',
        icon: Award,
        permission: 'SavingsPlan',
    },
    {
        title: 'Manual Payment Method Settings',
        href: '/manual-payment-methods',
        icon: BarChartHorizontalIcon,
        permission: 'ManualPaymentMethod',
    },
    {
        title: 'Investments',
        href: '/investments/create',
        icon: AlertTriangleIcon,
        permission: 'Investments',
    },
    {
        title: 'My Investments',
        href: '/investments',
        icon: BoomBox,
        permission: 'Investments',
    },
    {
        title: 'Investment Manager',
        href: '/admin/investments',
        icon: Hospital,
        permission: 'ManageInvestments',
    },
    {
        title: 'Transactions',
        href: '/transactions',
        icon: Hospital,
        permission: 'Investments',
    },
    {
        title: 'Savings',
        href: '/savings',
        icon: Hospital,
        permission: 'Investments',
    },
    {
        title: 'Loans',
        href: '/loans',
        icon: Hospital,
        permission: 'Loans',
    },
    {
        title: 'Loan Manager',
        href: '/admin/loans',
        icon: Hospital,
        permission: 'Loan Manager',
    },
    {
        title: 'Loan Settings',
        href: '/admin/loan-plans',
        icon: Hospital,
        permission: 'Loan Settings',
    },
    {
        title: 'User Tutorial',
        href: '/documentation/user',
        icon: HelpCircle,
        permission: 'Dashboard',
    },
    {
        title: 'Admin Docs',
        href: '/documentation/admin',
        icon: BookOpenCheck,
        permission: 'Admin Manager',
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="px-4 py-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-14 rounded-[12px] text-white hover:bg-white/10 data-[active=true]:bg-white/10"
                        >
                            <Link href="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-0">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="px-4 pb-5">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
