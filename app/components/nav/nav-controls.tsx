'use client';

import { TerminalIcon, TextSearchIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
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

export function NavControls() {
  const { t } = useTranslation('common');
  const orgInfoQueryOptions = useRouteContext({
    from: '/_dashboard/org/$org',
    select: (context) => context.orgInfoQueryOptions,
  });
  const { data: orgInfo } = useSuspenseQuery(orgInfoQueryOptions);

  const navLinks: NavLinks = [
    {
      title: t('orgSidebar.console'),
      icon: TerminalIcon,
      linkProps: {
        to: '/org/$org',
        params: { org: orgInfo.id },
      },
    },
    {
      title: t('orgSidebar.audit-log'),
      icon: TextSearchIcon,
      linkProps: {
        to: '/org/$org/audit-log',
        params: { org: orgInfo.id },
      },
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('orgSidebar.controlsGroup')}</SidebarGroupLabel>
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
