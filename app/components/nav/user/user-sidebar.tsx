import * as React from 'react';
import { Suspense } from 'react';
import { NavAccount } from '@/components/nav/nav-account';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavSecondary } from '@/components/nav/nav-secondary';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavUserOptions } from '@/components/nav/user/nav-user-options';
import { NavUserAdmin } from '@/components/nav/user/nav-user-admin';
import { NavDefaultSkeleton } from '@/components/nav/nav-default-skeleton';

export function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <ScrollArea className="h-[calc(100svh-4rem)] w-full pr-2">
        <SidebarContent className="min-h-[calc(100svh-4rem)]">
          <Suspense fallback={<NavDefaultSkeleton />}>
            <NavUserOptions />
            <NavUserAdmin />
          </Suspense>
          <NavSecondary className="mt-auto" />
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="h-16 justify-center">
        <NavAccount />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
