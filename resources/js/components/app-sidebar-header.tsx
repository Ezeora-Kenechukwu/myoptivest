// @ts-nocheck
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NotificationDetailsModal } from '@/components/NotificationDetailsModal';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { SidebarTrigger } from '@/components/ui/sidebar';
import echo from '@/echo';
import { useInitials } from '@/hooks/use-initials';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { notifications, auth } = usePage().props; // Get notifications from the Inertia page

    const getInitials = useInitials();
    const [selectedNotification, setSelectedNotification] = useState<any>(null); // Store selected notification for details modal
    const [notificationsArray, setNotificationsArray] = useState<any[]>([]);
    useEffect(() => {
        setNotificationsArray(Array.isArray(notifications) ? notifications : []);
    }, [notifications]);

    useEffect(() => {
        if (echo && auth?.user?.id) {
            echo.private(`App.Models.User.${auth.user.id}`).notification((notification) => {
                setNotificationsArray((prevNotifications) => {
                    const newNotification = {
                        ...notification,
                    };
                    return [newNotification, ...prevNotifications];
                });
            });
        }

        return () => {
            if (echo && auth?.user?.id) {
                echo.leave(`App.Models.User.${auth.user.id}`);
            }
        };
    }, [auth?.user?.id]);
    // Set selected notification for the modal view
    const openNotificationModal = (notification: any) => {
        setSelectedNotification(notification);
    };

    // Close the modal
    const closeNotificationModal = () => {
        setSelectedNotification(null);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-[#E9EAEB] bg-white/95 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 md:px-6">
            <div className="flex w-full items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <SidebarTrigger className="-ml-1 size-10 rounded-full border border-[#E9EAEB] text-[#414651] hover:bg-[#F6F5FF] hover:text-[#5042DA]" />
                    <div className="min-w-0">
                        <div className="hidden sm:block">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                        <h1 className="truncate text-lg font-semibold text-[#181D27] sm:hidden">
                            {breadcrumbs?.[breadcrumbs.length - 1]?.title || 'Dashboard'}
                        </h1>
                    </div>
                </div>

                {/* Notification Dropdown */}
                <div className="relative flex shrink-0 items-center gap-2">
                    <NotificationDropdown
                        notifications={notificationsArray}
                        onNotificationClick={openNotificationModal} // Handle notification click to open modal
                    />
                    <Avatar className="size-10 overflow-hidden rounded-full ring-2 ring-[#F6F5FF]">
                        <AvatarImage src={`/storage/${auth?.user.avatar}`} alt={auth?.user.name} />
                        <AvatarFallback className="bg-[#F6F5FF] text-sm font-semibold text-[#5042DA]">{getInitials(auth?.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden min-w-0 text-left leading-tight sm:grid">
                        <span className="font-inter max-w-[150px] truncate text-sm font-semibold text-[#414651]">
                            {auth?.user?.name?.split(' ')[0]}
                        </span>
                        <p className="text-xs text-[#A4A7AE] capitalize">{auth?.user?.type}</p>
                        {/* {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>} */}
                    </div>
                </div>
            </div>

            {/* Notification Details Modal */}
            {selectedNotification && <NotificationDetailsModal notification={selectedNotification} onClose={closeNotificationModal} />}
        </header>
    );
}
