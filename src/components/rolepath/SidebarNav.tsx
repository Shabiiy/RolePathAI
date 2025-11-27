
'use client';

import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
    LayoutDashboard,
    Network,
    ListChecks,
    Briefcase,
    MessageSquare,
    HelpCircle,
    BookCopy,
    ThumbsUp,
    Scale,
    History,
    Settings,
    FilePlus
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRolePathStore } from '@/hooks/use-rolepath-store';

const mainNav = [
    { href: '/home/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/home/roadmap', label: 'Roadmap', icon: Network },
    { href: '/home/analysis', label: 'Analysis', icon: ListChecks },
];

const toolsNav = [
    { href: '/home/projects', label: 'Projects', icon: Briefcase },
    { href: '/home/interview', label: 'Interview Prep', icon: MessageSquare },
    { href: '/home/quiz', label: 'Knowledge Quiz', icon: HelpCircle },
    { href: '/home/resources', label: 'Resources', icon: BookCopy },
    { href: '/home/recommend', label: 'AI Recommendations', icon: ThumbsUp },
    { href: '/home/compare', label: 'Compare Roles', icon: Scale },
];

const generalNav = [
     { href: '/home', label: 'New Roadmap', icon: FilePlus },
     { href: '/home/history', label: 'History', icon: History },
     { href: '/home/settings', label: 'Settings', icon: Settings },
]

export function SidebarNav() {
    const pathname = usePathname();
    const [state, , isHydrated] = useRolePathStore();
    
    // Crucially, we must not render anything that depends on the hydrated state on the server.
    // By returning null until the client has hydrated, we prevent a mismatch.
    if (!isHydrated) {
        return null;
    }

    const hasRoadmap = state.roadmaps.length > 0 && state.currentRoadmapIndex !== -1;

    // These nav items require a roadmap to be selected
    const roadmapDependentTools = [
        '/home/projects', 
        '/home/interview', 
        '/home/quiz', 
        '/home/resources',
        '/home/recommend'
    ];

    return (
        <div className="flex flex-col h-full p-2">
            {hasRoadmap && (
                 <SidebarMenu className="flex-1">
                    {mainNav.map(item => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={item.label}
                                disabled={!hasRoadmap}
                                aria-disabled={!hasRoadmap}
                            >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            )}
           
            <SidebarMenu className="flex-1">
                <span className="text-xs text-muted-foreground px-2 py-1">AI Tools</span>
                {toolsNav.map(item => {
                    const isDisabled = !hasRoadmap && roadmapDependentTools.includes(item.href);
                    return (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={item.label}
                                disabled={isDisabled}
                                aria-disabled={isDisabled}
                            >
                                <Link href={isDisabled ? '#' : item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
           
            <SidebarMenu>
                <span className="text-xs text-muted-foreground px-2 py-1">General</span>
                 {generalNav.map(item => (
                    <SidebarMenuItem key={item.href}>
                         <SidebarMenuButton
                            asChild
                            isActive={pathname === item.href && item.href !== '/home'}
                            tooltip={item.label}
                        >
                             <Link href={item.href} prefetch={item.href === '/home' ? false : undefined}>
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>
    );
}
