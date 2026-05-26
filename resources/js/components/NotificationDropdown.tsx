// NotificationDropdown.tsx
import formatMessageDateShort from '@/utils/formatMessageDateShort';
import formatNotificationType from '@/utils/formatNotificationType';
import { useForm } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { useState } from 'react';

type Notification = {
    id: number;
    message: string;
    type: string;
    read_at: string;
    data: {
        action_url: string;
        celebrity_name: string;
        message: string;
        reservation_id: string;
    };
    read: boolean;
    created_at: string;
};

export function NotificationDropdown({
    notifications = [],
    onNotificationClick,
}: {
    notifications: Notification[];
    onNotificationClick?: (notification: Notification) => void;
}) {
    const { post } = useForm();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Mark individual notification as read
    const markAsRead = (id: number) => {
        post(route('notifications.markAsRead', id));
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        post(route('notifications.markAllAsRead'));
    };

    const unreadCount = notifications.filter((notif) => !notif.read_at).length;

    return (
        <div className="relative dark:text-slate-950">
            <button
                type="button"
                className="relative z-10 flex size-10 items-center justify-center rounded-full border border-[#E9EAEB] bg-white text-[#181D27] transition hover:bg-[#F6F5FF] hover:text-[#5042DA] focus:ring-2 focus:ring-[#5042DA]/20 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Notifications"
            >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 inline-flex size-2.5 rounded-full border-2 border-white bg-[#F04438]"></span>
                )}
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 max-h-[420px] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[18px] border border-[#E9EAEB] bg-white shadow-[0_18px_42px_rgba(10,13,18,0.14)]">
                    <div className="flex items-center justify-between border-b border-[#E9EAEB] px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-[#181D27]">Notifications</p>
                            <p className="text-xs text-[#717680]">{unreadCount} unread</p>
                        </div>
                        <button onClick={markAllAsRead} className="text-xs font-semibold text-[#5042DA]">
                            Mark all read
                        </button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto p-2">
                        {notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-[#717680]">No notifications</p>
                        ) : (
                            notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={() => {
                                        markAsRead(notif.id);
                                        onNotificationClick?.(notif);
                                    }}
                                    className={`my-1 flex w-full flex-col rounded-[14px] px-3 py-3 text-left transition hover:bg-[#F6F5FF] ${!notif.read_at ? 'bg-[#FAFAFF]' : ''}`}
                                >
                                    <span className="text-sm font-semibold text-[#181D27]">{formatNotificationType(notif.type)}</span>
                                    <span className="mt-1 text-sm text-[#717680]">{notif.data.message}</span>
                                    <span className="mt-2 text-xs text-[#A4A7AE]">{formatMessageDateShort(notif.created_at)}</span>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="border-t border-[#E9EAEB] px-4 py-3 text-right">
                        <button onClick={() => setDropdownOpen(false)} className="text-sm font-semibold text-[#414651]">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
