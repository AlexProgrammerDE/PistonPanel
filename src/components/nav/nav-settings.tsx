import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Link,
  LinkProps,
  useParams,
  useRouteContext,
} from '@tanstack/react-router';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BoltIcon } from 'lucide-react';
import { hasInstancePermission } from '@/lib/utils';
import { InstancePermission } from '@/generated/pistonpanel/common';
import { useSuspenseQuery } from '@tanstack/react-query';
import { instanceInfoQueryOptions } from '@/lib/queries';

type NavLink = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
};

export function NavSettings() {
  const { t } = useTranslation('common');
  const { instance } = useParams({
    from: '/_dashboard/instance/$instance',
  });
  const { data: instanceInfo } = useSuspenseQuery(
    instanceInfoQueryOptions(instance),
  );

  const navLinks: NavLink[] = [
    ...(hasInstancePermission(
      instanceInfo,
      InstancePermission.UPDATE_INSTANCE_META,
    )
      ? [
          {
            title: t('instanceSidebar.metaSettings'),
            icon: BoltIcon,
            linkProps: {
              to: '/instance/$instance/meta',
              params: { instance: instanceInfo.id },
            },
          } satisfies NavLink,
        ]
      : []),
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {t('instanceSidebar.settingsGroup')}
      </SidebarGroupLabel>
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
