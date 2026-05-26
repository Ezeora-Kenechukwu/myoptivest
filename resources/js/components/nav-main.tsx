import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAbilities } from '@/hooks/useAbilities';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { checkAbility } = useAbilities('');
    return (
        <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="px-3 text-[11px] tracking-normal text-white/60 uppercase">Platform</SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const permission = item.permission ?? 'Dashboard';
                    const canAccess = checkAbility(permission, 'can_index') || checkAbility(permission, 'can_view');

                    if (!canAccess) {
                        return null; // don't show link if user can't index or view
                    }
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={item.href === page.url}
                                className="h-11 rounded-[10px] px-3 text-[15px] text-white/75 transition hover:bg-white hover:text-[#5042DA] data-[active=true]:bg-white data-[active=true]:font-semibold data-[active=true]:text-[#5042DA]"
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
