import { Circle } from 'lucide-react';

const Badge = ({ status }) => {
    const label = String(status || 'status').toLowerCase();
    const colorMap = {
        approved: 'border-[#079455] bg-[#ECFDF3] text-[#079455]',
        pending: 'border-[#EAAA08] bg-[#FFFAEB] text-[#B54708]',
        rejected: 'border-[#F04438] bg-[#FEF3F2] text-[#D92D20]',
        active: 'border-[#079455] bg-[#ECFDF3] text-[#079455]',
        inactive: 'border-[#D5D7DA] bg-[#F5F5F5] text-[#717680]',
    };

    return (
        <span
            className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold capitalize ${colorMap[label] || 'border-[#D5D7DA] bg-white text-[#414651]'}`}
        >
            <Circle className="size-2 fill-current" />
            {status}
        </span>
    );
};

export default Badge;
