'use client';

import { BotIcon, LayoutDashboardIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, LinkProps, useRouteContext } from '@tanstack/react-router';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSuspenseQuery } from '@tanstack/react-query';

type NavLinks = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
}[];

export function NavTop() {
  const { t } = useTranslation('common');
  const orgInfoQueryOptions = useRouteContext({
    from: '/_dashboard/org/$org',
    select: (context) => context.orgInfoQueryOptions,
  });
  const { data: orgInfo } = useSuspenseQuery(orgInfoQueryOptions);

  const navLinks: NavLinks = [
    {
      title: t('orgSidebar.overview'),
      icon: LayoutDashboardIcon,
      linkProps: {
        to: '/org/$org',
        params: { org: orgInfo.slug },
      },
    },
    {
      title: t('orgSidebar.assistant'),
      icon: BotIcon,
      linkProps: {
        to: '/org/$org',
        params: { org: orgInfo.slug },
      },
    },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navLinks.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link
                activeOptions={{ exact: true }}
                activeProps={{
                  'data-active': true,
                }}
                {...item.linkProps}
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
