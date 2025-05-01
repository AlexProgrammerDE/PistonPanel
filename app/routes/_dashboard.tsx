import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { InstanceState } from '@/generated/pistonpanel/instance';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { CreateInstanceProvider } from '@/components/dialog/create-instance-dialog';
import { authClient } from '@/auth/auth-client';
import { useAuthenticate } from '@daveyplate/better-auth-ui';
import { getTerminalTheme } from '@/lib/utils';
import { TerminalThemeContext } from '@/components/providers/terminal-theme-context';

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: async (props) => {
    const { data: session } = await authClient.getSession();
    if (session) {
      const instanceListQueryOptions = queryOptions({
        queryKey: ['instance-list'],
        queryFn: () => {
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
        queryFn: async () => {
          return await authClient.getSession({
            fetchOptions: {
              throw: true,
            },
          });
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
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/auth/$pathname',
        params: {
          pathname: 'sign-in',
        },
        search: {
          redirect: props.location.href,
        },
      });
    }
  },
  // To make pendingComponent work on root route
  wrapInSuspense: true,
  component: DashboardLayout,
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

  const { clientDataQueryOptions } = Route.useRouteContext();
  const { data: session } = useSuspenseQuery(clientDataQueryOptions);
  const [terminalTheme, setTerminalTheme] = useState(getTerminalTheme());

  return (
    <>
      <Suspense>
        <InstanceSwitchKeybinds />
      </Suspense>
      {session.session.impersonatedBy && (
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
    </>
  );
}
