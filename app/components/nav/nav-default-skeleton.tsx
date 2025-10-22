import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "../ui/sidebar";

const NAV_SKELETON_KEYS = Array.from(
  { length: 5 },
  (_, index) => `nav-skeleton-${index}`,
);

export function NavDefaultSkeleton() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {NAV_SKELETON_KEYS.map((placeholderKey) => (
          <SidebarMenuItem key={placeholderKey}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
