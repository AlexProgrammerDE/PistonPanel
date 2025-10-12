"use client";

import { OrganizationSwitcher } from "@daveyplate/better-auth-ui";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavOrgSwitcher() {
  const sidebar = useSidebar();
  return (
    <OrganizationSwitcher
      className={cn("w-full", {
        "gap-0 overflow-hidden !p-0 [&>svg]:!w-0": !sidebar.open,
      })}
      variant="ghost"
    />
  );
}
