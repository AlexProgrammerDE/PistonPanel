import { CatchBoundary, createFileRoute, Outlet } from '@tanstack/react-router';
import { createTransport } from '@/lib/web-rpc';
import { InstanceServiceClient } from '@/generated/pistonpanel/instance.client';
import { InstanceState } from '@/generated/pistonpanel/instance';
import { queryOptions } from '@tanstack/react-query';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { InstanceSidebar } from '@/components/nav/instance-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorComponent } from '@/components/error-component';
import { InstanceInfoQueryData } from '@/lib/types';

export const Route = createFileRoute('/_dashboard/instance/$instance')({
  beforeLoad: (props) => {
    const { instance } = props.params;
    const instanceInfoQueryOptions = queryOptions({
      queryKey: ['instance-info', instance],
      queryFn: async (props): Promise<InstanceInfoQueryData> => {
        const transport = createTransport();
        if (transport === null) {
          return {
            id: instance,
            friendlyName: 'Demo',
            icon: 'pickaxe',
            instancePermissions: [],
            state: InstanceState.RUNNING,
          };
        }

        const instanceService = new InstanceServiceClient(transport);
        const result = await instanceService.getInstanceInfo(
          {
            id: instance,
          },
          {
            abort: props.signal,
          },
        );

        return {
          id: instance,
          ...result.response,
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
