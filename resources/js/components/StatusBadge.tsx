import { Circle } from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string }> = {
    success: { label: 'Success', className: 'border-[#079455] bg-[#ECFDF3] text-[#079455]' },
    active: { label: 'Active', className: 'border-[#079455] bg-[#ECFDF3] text-[#079455]' },
    confirmed: { label: 'Confirmed', className: 'border-[#079455] bg-[#ECFDF3] text-[#079455]' },
    approved: { label: 'Approved', className: 'border-[#079455] bg-[#ECFDF3] text-[#079455]' },
    paid: { label: 'Paid', className: 'border-[#079455] bg-[#ECFDF3] text-[#079455]' },
    pending: { label: 'Pending', className: 'border-[#EAAA08] bg-[#FFFAEB] text-[#B54708]' },
    failed: { label: 'Failed', className: 'border-[#F04438] bg-[#FEF3F2] text-[#D92D20]' },
    declined: { label: 'Declined', className: 'border-[#F04438] bg-[#FEF3F2] text-[#D92D20]' },
    cancelled: { label: 'Cancelled', className: 'border-[#F04438] bg-[#FEF3F2] text-[#D92D20]' },
    rejected: { label: 'Rejected', className: 'border-[#F04438] bg-[#FEF3F2] text-[#D92D20]' },
    inactive: { label: 'Inactive', className: 'border-[#D5D7DA] bg-[#F5F5F5] text-[#717680]' },
};

const formatLabel = (status: string) =>
    status
        .replace(/[_-]/g, ' ')
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const StatusBadge = ({ status }: { status: string }) => {
    const key = String(status || 'pending').toLowerCase();
    const config = statusConfig[key] || {
        label: formatLabel(String(status || 'Pending')),
        className: 'border-[#D5D7DA] bg-white text-[#414651]',
    };

    return (
        <span className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs leading-none font-semibold ${config.className}`}>
            <Circle className="size-2 fill-current" />
            {config.label}
        </span>
    );
};

export default StatusBadge;
