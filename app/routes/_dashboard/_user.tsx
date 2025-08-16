import { CatchBoundary, createFileRoute, Outlet } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/nav/user/user-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorComponent } from '@/components/error-component';
import { useIsMobile } from '@/hooks/use-mobile';

export const Route = createFileRoute('/_dashboard/_user')({
  component: UserLayout,
});

function UserLayout() {
  const isMobile = useIsMobile();
  const sidebarState = localStorage.getItem('sidebar:state');
  const defaultOpen =
    sidebarState === null ? !isMobile : sidebarState === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <UserSidebar />
      <TooltipProvider delayDuration={500}>
        <SidebarInset>
          <CatchBoundary
            getResetKey={() => 'user-layout'}
            errorComponent={ErrorComponent}
          >
            <Outlet />
          </CatchBoundary>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
