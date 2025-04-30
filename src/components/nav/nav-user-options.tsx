'use client';

import { Grid2x2Icon, PlusIcon, SettingsIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, LinkProps } from '@tanstack/react-router';
import * as React from 'react';
import { ReactNode, use } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateInstanceContext } from '@/components/dialog/create-instance-dialog';
import { useGlobalPermission } from '@/hooks/use-global-permission';

type NavLinks = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
  createInstance?: boolean;
}[];

export function NavUserOptions() {
  const { t } = useTranslation('common');
  const { openCreateInstance } = use(CreateInstanceContext);
  const createInstancePermission = useGlobalPermission({
    permissions: {
      organization: ['create'],
    },
  });

  const navLinks: NavLinks = [
    {
      title: t('userSidebar.instances'),
      icon: Grid2x2Icon,
      linkProps: {
        to: '/user',
        params: {},
      },
      createInstance: true,
    },
    {
      title: t('userSidebar.settings'),
      icon: SettingsIcon,
      linkProps: {
        to: '/user/settings',
        params: {},
      },
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('userSidebar.userGroup')}</SidebarGroupLabel>
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
            {item.createInstance && createInstancePermission && (
              <>
                <SidebarMenuAction
                  onClick={openCreateInstance}
                  title={t('userSidebar.createInstance')}
                >
                  <PlusIcon />
                </SidebarMenuAction>
              </>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
