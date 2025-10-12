"use client";

import { accountViewPaths, authLocalization } from "@daveyplate/better-auth-ui";
import { Link, type LinkProps } from "@tanstack/react-router";
import {
  BuildingIcon,
  HouseIcon,
  KeyIcon,
  LockIcon,
  type LucideIcon,
  SettingsIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { smartEntries } from "@/lib/utils";

type NavLink = {
  title: string;
  icon: (props: { className: string }) => ReactNode;
  linkProps: LinkProps;
  createOrg?: boolean;
};

export function NavUserOptions() {
  const { t } = useTranslation("common");

  function viewToIcon(view: keyof typeof accountViewPaths): LucideIcon {
    switch (view) {
      case "SETTINGS":
        return SettingsIcon;
      case "API_KEYS":
        return KeyIcon;
      case "ORGANIZATIONS":
        return BuildingIcon;
      case "SECURITY":
        return LockIcon;
    }
  }

  const topNavLinks: NavLink[] = [
    {
      title: t("userSidebar.overview"),
      icon: HouseIcon,
      linkProps: {
        to: "/",
        params: {},
      },
    },
  ];

  const navLinks: NavLink[] = [
    ...smartEntries(accountViewPaths).map(
      (view) =>
        ({
          title: authLocalization[view[0]],
          icon: viewToIcon(view[0]),
          linkProps: {
            to: "/$pathname",
            params: {
              pathname: view[1],
            },
          },
        }) satisfies NavLink,
    ),
  ];

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          {topNavLinks.map((item) => (
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
      <SidebarGroup>
        <SidebarGroupLabel>{t("userSidebar.userGroup")}</SidebarGroupLabel>
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
    </>
  );
}
