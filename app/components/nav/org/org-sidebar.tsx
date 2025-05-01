import * as React from 'react';
import { Suspense } from 'react';

import { NavControls } from '@/components/nav/org/nav-controls';
import { NavSettings } from '@/components/nav/org/nav-settings';
import { NavAccount } from '@/components/nav/nav-account';
import { NavPlugins } from '@/components/nav/org/nav-plugins';
import { OrgSwitcher } from '@/components/nav/org/org-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavSecondary } from '@/components/nav/nav-secondary';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavDefaultSkeleton } from '@/components/nav/nav-default-skeleton';

export function OrgSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16">
        <OrgSwitcher />
      </SidebarHeader>
      <ScrollArea className="h-[calc(100svh-4rem-4rem)] w-full pr-2">
        <SidebarContent className="min-h-[calc(100svh-4rem-4rem)]">
          <Suspense fallback={<NavDefaultSkeleton />}>
            <NavControls />
            <NavSettings />
            <NavPlugins />
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
