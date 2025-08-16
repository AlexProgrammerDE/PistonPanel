import * as React from 'react';
import { BookOpenTextIcon, CoffeeIcon, type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from '@/components/external-link';
import { SiDiscord } from '@icons-pack/react-simple-icons';

type NavLink = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { t } = useTranslation('common');
  const items: NavLink[] = [
    {
      title: t('sidebar.documentation'),
      url: 'https://pistonpanel.com/docs',
      icon: BookOpenTextIcon,
    },
    {
      title: t('sidebar.buyMeACoffee'),
      url: 'https://ko-fi.com/alexprogrammerde',
      icon: CoffeeIcon,
    },
    {
      title: t('sidebar.discord'),
      url: 'https://pistonpanel.com/discord',
      icon: SiDiscord,
    },
  ];

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                <ExternalLink href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </ExternalLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
