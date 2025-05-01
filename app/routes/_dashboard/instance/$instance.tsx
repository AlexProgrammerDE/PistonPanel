import { CatchBoundary, createFileRoute, Outlet } from '@tanstack/react-router';
import { InstanceState } from '@/generated/pistonpanel/instance';
import { queryOptions } from '@tanstack/react-query';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { InstanceSidebar } from '@/components/nav/instance-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorComponent } from '@/components/error-component';

export const Route = createFileRoute('/_dashboard/instance/$instance')({
  beforeLoad: (props) => {
    const { instance } = props.params;
    const instanceInfoQueryOptions = queryOptions({
      queryKey: ['instance-info', instance],
      queryFn: () => {
        return {
          id: instance,
          friendlyName: 'Demo',
          icon: 'pickaxe',
          instancePermissions: [],
          state: InstanceState.RUNNING,
        };
      },
      refetchInterval: 3_000,
    });
    props.abortController.signal.addEventListener('abort', () => {
      void props.context.queryClient.cancelQueries({
        queryKey: instanceInfoQueryOptions.queryKey,
      });
    });
    return {
      instanceInfoQueryOptions,
    };
  },
  loader: (props) => {
    void props.context.queryClient.prefetchQuery(
      props.context.instanceInfoQueryOptions,
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
