import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { CreateInstanceProvider } from '@/components/dialog/create-instance-dialog';
import { useAuthenticate } from '@daveyplate/better-auth-ui';
import { getTerminalTheme } from '@/lib/utils';
import { TerminalThemeContext } from '@/components/providers/terminal-theme-context';
import { createServerFn } from '@tanstack/react-start';
import { auth } from '@/auth/auth-server';
import { getWebRequest } from 'vinxi/http';
import {
  clientDataQueryOptions,
  instanceListQueryOptions,
} from '@/lib/queries';

const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  return await auth.api.getSession({
    headers: getWebRequest().headers,
  });
});

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: async (props) => {
    const user = await fetchUser();
    if (!user) {
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
  loader: async (props) => {
    await props.context.queryClient.ensureQueryData(instanceListQueryOptions());
    await props.context.queryClient.ensureQueryData(clientDataQueryOptions());
  },
  // To make pendingComponent work on root route
  wrapInSuspense: true,
  component: DashboardLayout,
});

function InstanceSwitchKeybinds() {
  const navigate = useNavigate();
  const { data: instanceList } = useSuspenseQuery(instanceListQueryOptions());

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

  const { data: session } = useSuspenseQuery(clientDataQueryOptions());
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
