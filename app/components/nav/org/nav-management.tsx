import {
  authLocalization,
  organizationViewPaths,
} from "@daveyplate/better-auth-ui";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, type LinkProps, useRouteContext } from "@tanstack/react-router";
import {
  KeyIcon,
  type LucideIcon,
  SettingsIcon,
  TextSearchIcon,
  UsersIcon,
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
};

export function NavManagement() {
  const { t } = useTranslation("common");
  const orgInfoQueryOptions = useRouteContext({
    from: "/_dashboard/org/$org",
    select: (context) => context.orgInfoQueryOptions,
  });
  const { data: orgInfo } = useSuspenseQuery(orgInfoQueryOptions);

  function viewToIcon(view: keyof typeof organizationViewPaths): LucideIcon {
    switch (view) {
      case "SETTINGS":
        return SettingsIcon;
      case "MEMBERS":
        return UsersIcon;
      case "API_KEYS":
        return KeyIcon;
    }
  }

  const navLinks: NavLink[] = [
    ...smartEntries(organizationViewPaths).map(
      (view) =>
        ({
          title: authLocalization[view[0]],
          icon: viewToIcon(view[0]),
          linkProps: {
            to: "/org/$org/$pathname",
            params: { org: orgInfo.slug, pathname: view[1] },
          },
        }) satisfies NavLink,
    ),
    {
      title: t("orgSidebar.audit-log"),
      icon: TextSearchIcon,
      linkProps: {
        to: "/org/$org/audit-log",
        params: { org: orgInfo.slug },
      },
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("orgSidebar.managementGroup")}</SidebarGroupLabel>
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
