import { TransportContext } from '@/components/providers/transport-context';
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { ClientServiceClient } from '@/generated/pistonpanel/client.client';
import { createTransport } from '@/lib/web-rpc';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { ClientDataResponse } from '@/generated/pistonpanel/client';
import {
  InstanceListResponse,
  InstanceState,
} from '@/generated/pistonpanel/instance';
import { InstanceServiceClient } from '@/generated/pistonpanel/instance.client';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorComponent } from '@/components/error-component';
import { CreateInstanceProvider } from '@/components/dialog/create-instance-dialog';
import { authClient } from '@/lib/auth-client';
import { useAuthenticate } from '@daveyplate/better-auth-ui';
import { getTerminalTheme } from '@/lib/utils';
import { TerminalThemeContext } from '@/components/providers/terminal-theme-context';

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: async (props) => {
    const { data: session } = await authClient.getSession();
    if (session) {
      const instanceListQueryOptions = queryOptions({
        queryKey: ['instance-list'],
        queryFn: async (props): Promise<InstanceListResponse> => {
          const transport = createTransport();
          if (transport === null) {
            return {
              instances: [
                {
                  id: 'demo',
                  friendlyName: 'Demo',
                  icon: 'pickaxe',
                  state: InstanceState.RUNNING,
                  instancePermissions: [],
                },
              ],
            };
          }

          const instanceService = new InstanceServiceClient(transport);
          const result = await instanceService.listInstances(
            {},
            {
              abort: props.signal,
            },
          );

          return result.response;
        },
        refetchInterval: 3_000,
      });
      props.abortController.signal.addEventListener('abort', () => {
        void props.context.queryClient.cancelQueries({
          queryKey: instanceListQueryOptions.queryKey,
        });
      });
      const clientDataQueryOptions = queryOptions({
        queryKey: ['client-data'],
        queryFn: async (props): Promise<ClientDataResponse> => {
          const transport = createTransport();

          const clientService = new ClientServiceClient(transport);
          const result = await clientService.getClientData(
            {},
            {
              abort: props.signal,
            },
          );

          return result.response;
        },
      });
      props.abortController.signal.addEventListener('abort', () => {
        void props.context.queryClient.cancelQueries({
          queryKey: clientDataQueryOptions.queryKey,
        });
      });
      return {
        instanceListQueryOptions,
        clientDataQueryOptions,
        session,
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/',
        search: {
          redirect: props.location.href,
        },
      });
    }
  },
  loader: (
    props,
  ):
    | {
        success: true;
        transport: GrpcWebFetchTransport | null;
      }
    | {
        success: false;
        connectionError: object;
      } => {
    const transport = createTransport();
    if (transport === null) {
      return {
        success: true,
        transport,
      };
    }

    try {
      void props.context.queryClient.prefetchQuery(
        props.context.instanceListQueryOptions,
      );
      void props.context.queryClient.prefetchQuery(
        props.context.clientDataQueryOptions,
      );

      return {
        success: true,
        transport,
      };
    } catch (e) {
      return {
        success: false,
        connectionError: e as object,
      };
    }
  },
  component: DashboardLayout,
  // Ensure we show the pending component when needed
  wrapInSuspense: true,
});

function InstanceSwitchKeybinds() {
  const navigate = useNavigate();
  const { instanceListQueryOptions } = Route.useRouteContext();
  const { data: instanceList } = useSuspenseQuery(instanceListQueryOptions);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const numberKey = parseInt(e.key);
        if (numberKey > 0 && numberKey <= instanceList.instances.length) {
          e.preventDefault();
          void navigate({
            to: '/instance/$instance',
            params: { instance: instanceList.instances[numberKey - 1].id },
          });
        }
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [instanceList.instances, navigate]);

  return null;
}

function DashboardLayout() {
  useAuthenticate();

  const { t } = useTranslation('common');
  const { session } = Route.useRouteContext();
  const loaderData = Route.useLoaderData();
  const [terminalTheme, setTerminalTheme] = useState(getTerminalTheme());
  if (!loaderData.success) {
    return <ErrorComponent error={new Error(t('error.connectionFailed'))} />;
  }

  return (
    <TransportContext value={loaderData.transport}>
      <Suspense>
        <InstanceSwitchKeybinds />
      </Suspense>
      {!!session?.session?.impersonatedBy && (
        <div className="border-sidebar-primary pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-30 overflow-hidden border-4" />
      )}
      <CreateInstanceProvider>
        <TerminalThemeContext
          value={{
            value: terminalTheme,
            setter: setTerminalTheme,
          }}
        >
          <Outlet />
        </TerminalThemeContext>
      </CreateInstanceProvider>
    </TransportContext>
  );
}
