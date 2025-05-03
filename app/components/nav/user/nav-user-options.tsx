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
import { CreateOrgContext } from '@/components/dialog/create-org-dialog';
import { useGlobalPermission } from '@/hooks/use-global-permission';

type NavLinks = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
  createOrg?: boolean;
}[];

export function NavUserOptions() {
  const { t } = useTranslation('common');
  const { openCreateOrg } = use(CreateOrgContext);
  const createOrgPermission = useGlobalPermission({
    organization: ['create'],
  });

  const navLinks: NavLinks = [
    {
      title: t('userSidebar.orgs'),
      icon: Grid2x2Icon,
      linkProps: {
        to: '/',
        params: {},
      },
      createOrg: true,
    },
    {
      title: t('userSidebar.settings'),
      icon: SettingsIcon,
      linkProps: {
        to: '/settings',
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
            {item.createOrg && createOrgPermission && (
              <>
                <SidebarMenuAction
                  onClick={openCreateOrg}
                  title={t('userSidebar.createOrg')}
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
