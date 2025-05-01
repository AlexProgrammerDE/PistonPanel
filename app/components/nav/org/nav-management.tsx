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
import {
  BoltIcon,
  CogIcon,
  ScanEyeIcon,
  TextSearchIcon,
  UsersIcon,
} from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';

type NavLink = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
};

export function NavManagement() {
  const { t } = useTranslation('common');
  const orgInfoQueryOptions = useRouteContext({
    from: '/_dashboard/org/$org',
    select: (context) => context.orgInfoQueryOptions,
  });
  const { data: orgInfo } = useSuspenseQuery(orgInfoQueryOptions);

  const navLinks: NavLink[] = [
    {
      title: t('orgSidebar.settings'),
      icon: CogIcon,
      linkProps: {
        to: '/org/$org/settings',
        params: { org: orgInfo.slug },
      },
    } satisfies NavLink,
    {
      title: t('orgSidebar.members'),
      icon: UsersIcon,
      linkProps: {
        to: '/org/$org/members',
        params: { org: orgInfo.slug },
      },
    } satisfies NavLink,
    {
      title: t('orgSidebar.teams'),
      icon: ScanEyeIcon,
      linkProps: {
        to: '/org/$org/teams',
        params: { org: orgInfo.slug },
      },
    } satisfies NavLink,
    {
      title: t('orgSidebar.audit-log'),
      icon: TextSearchIcon,
      linkProps: {
        to: '/org/$org/audit-log',
        params: { org: orgInfo.slug },
      },
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('orgSidebar.managementGroup')}</SidebarGroupLabel>
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
