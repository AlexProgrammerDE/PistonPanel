'use client';

import { ChartAreaIcon, UsersIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, LinkProps } from '@tanstack/react-router';
import * as React from 'react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalPermission } from '@/hooks/use-global-permission';

type NavLink = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
};

export function NavUserAdmin() {
  const { t } = useTranslation('common');
  const listUsersPermission = useGlobalPermission({
    user: ['list'],
  });

  if (!listUsersPermission) {
    return null;
  }

  const navLinks: NavLink[] = [
    {
      title: t('userSidebar.adminOverview'),
      icon: ChartAreaIcon,
      linkProps: {
        to: '/admin',
        params: {},
      },
    },
    {
      title: t('userSidebar.users'),
      icon: UsersIcon,
      linkProps: {
        to: '/admin/users',
        params: {},
      },
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('userSidebar.adminGroup')}</SidebarGroupLabel>
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
