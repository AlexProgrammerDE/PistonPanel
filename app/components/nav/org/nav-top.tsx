"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, type LinkProps, useRouteContext } from "@tanstack/react-router";
import { BotIcon, HomeIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavLink = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
};

export function NavTop() {
  const { t } = useTranslation("common");
  const orgInfoQueryOptions = useRouteContext({
    from: "/_dashboard/org/$org",
    select: (context) => context.orgInfoQueryOptions,
  });
  const { data: orgInfo } = useSuspenseQuery(orgInfoQueryOptions);

  const navLinks: NavLink[] = [
    {
      title: t("orgSidebar.dashboard"),
      icon: HomeIcon,
      linkProps: {
        to: "/org/$org",
        params: { org: orgInfo.slug },
      },
    },
    {
      title: t("orgSidebar.assistant"),
      icon: BotIcon,
      linkProps: {
        to: "/org/$org/assistant",
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
                  "data-active": true,
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
