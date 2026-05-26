// NotificationsPage.tsx
// import { useEffect, useState } from 'react';
// import { Inertia } from '@inertiajs/inertia';
import { NotificationDropdown } from '@/components/NotificationDropdown';

export default function NotificationsPage({ notifications }: { notifications: any[] }) {
  return (
    <div>
      <NotificationDropdown notifications={notifications} />
    </div>
  );
}


