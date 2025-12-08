'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarNav } from './SidebarNav';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4 md:hidden border-b">
          <SidebarTrigger />
          <span className="font-medium">Menu</span>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
