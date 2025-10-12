"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, type LinkProps, useRouteContext } from "@tanstack/react-router";
import { DatabaseIcon, NetworkIcon, ServerIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavLink = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
};

export function NavResources() {
  const { t } = useTranslation("common");
  const orgInfoQueryOptions = useRouteContext({
    from: "/_dashboard/org/$org",
    select: (context) => context.orgInfoQueryOptions,
  });
  const { data: orgInfo } = useSuspenseQuery(orgInfoQueryOptions);

  const navLinks: NavLink[] = [
    {
      title: t("orgSidebar.servers"),
      icon: ServerIcon,
      linkProps: {
        to: "/org/$org/servers",
        params: { org: orgInfo.slug },
      },
    },
    {
      title: t("orgSidebar.networks"),
      icon: NetworkIcon,
      linkProps: {
        to: "/org/$org/networks",
        params: { org: orgInfo.slug },
      },
    },
    {
      title: t("orgSidebar.databases"),
      icon: DatabaseIcon,
      linkProps: {
        to: "/org/$org/databases",
        params: { org: orgInfo.slug },
      },
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("orgSidebar.resourcesGroup")}</SidebarGroupLabel>
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
