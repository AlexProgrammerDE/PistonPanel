'use client';

import {
  BuildingIcon,
  Grid2x2Icon,
  KeyIcon,
  LockIcon,
  LucideIcon,
  PlusIcon,
  SettingsIcon,
} from 'lucide-react';
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
import { smartEntries } from '@/lib/utils';
import { accountViewPaths, authLocalization } from '@daveyplate/better-auth-ui';

type NavLink = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
  createOrg?: boolean;
};

export function NavUserOptions() {
  const { t } = useTranslation('common');
  const { openCreateOrg } = use(CreateOrgContext);
  const createOrgPermission = useGlobalPermission({
    organization: ['create'],
  });

  function viewToIcon(view: keyof typeof accountViewPaths): LucideIcon {
    switch (view) {
      case 'SETTINGS':
        return SettingsIcon;
      case 'API_KEYS':
        return KeyIcon;
      case 'ORGANIZATIONS':
        return BuildingIcon;
      case 'SECURITY':
        return LockIcon;
      case 'ACCEPT_INVITATION':
        throw new Error('ACCEPT_INVITATION view should not be used in sidebar');
    }
  }

  const navLinks: NavLink[] = [
    {
      title: t('userSidebar.orgs'),
      icon: Grid2x2Icon,
      linkProps: {
        to: '/',
        params: {},
      },
      createOrg: true,
    },
    ...smartEntries(accountViewPaths)
      .filter((view) => view[0] !== 'ACCEPT_INVITATION')
      .map(
        (view) =>
          ({
            title: authLocalization[view[0]],
            icon: viewToIcon(view[0]),
            linkProps: {
              to: '/$pathname',
              params: {
                pathname: view[1],
              },
            },
          }) satisfies NavLink,
      ),
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
