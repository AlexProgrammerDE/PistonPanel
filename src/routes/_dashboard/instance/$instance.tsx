import { CatchBoundary, createFileRoute, Outlet } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { InstanceSidebar } from '@/components/nav/instance-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorComponent } from '@/components/error-component';
import { instanceInfoQueryOptions } from '@/lib/queries';

export const Route = createFileRoute('/_dashboard/instance/$instance')({
  loader: async (props) => {
    await props.context.queryClient.ensureQueryData(
      instanceInfoQueryOptions(props.params.instance),
    );
  },
  component: InstanceLayout,
});

function InstanceLayout() {
  const defaultOpen = localStorage.getItem('sidebar:state') === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <InstanceSidebar />
      <TooltipProvider delayDuration={500}>
        <SidebarInset>
          <CatchBoundary
            getResetKey={() => 'instance-layout'}
            errorComponent={ErrorComponent}
          >
            <Outlet />
          </CatchBoundary>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
