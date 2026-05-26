import Modal from '@/components/Modal';

type NotificationRecord = {
  id?: number | string;
  message?: string;
  data?: { message?: string; title?: string } | null;
  created_at?: string;
};

export function NotificationDetailsModal({ notification, onClose }: { notification: NotificationRecord | null; onClose?: () => void }) {
  const message = notification?.message ?? notification?.data?.message ?? notification?.data?.title ?? 'Notification details';

  return (
    <Modal closeable={true} show={!!notification} onClose={onClose ?? (() => undefined)}>
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-[#0A0D12]">{message}</h3>
        {notification?.created_at && <p className="mt-2 text-sm text-[#717680]">Created at: {notification.created_at}</p>}
      </div>
    </Modal>
  );
}
