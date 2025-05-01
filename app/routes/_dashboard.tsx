import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { CreateOrgProvider } from '@/components/dialog/create-org-dialog';
import { authClient } from '@/auth/auth-client';
import { useAuthenticate } from '@daveyplate/better-auth-ui';
import { getTerminalTheme } from '@/lib/utils';
import { TerminalThemeContext } from '@/components/providers/terminal-theme-context';

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: async (props) => {
    const { data: session } = await authClient.getSession();
    if (session) {
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

function OrgSwitchKeybinds() {
  const navigate = useNavigate();
  const { data: orgList } = authClient.useListOrganizations();
  if (orgList === null) {
    return null;
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const numberKey = parseInt(e.key);
        if (numberKey > 0 && numberKey <= orgList.length) {
          e.preventDefault();
          void navigate({
            to: '/org/$org',
            params: { org: orgList[numberKey - 1].slug },
          });
        }
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [orgList, navigate]);

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
        <OrgSwitchKeybinds />
      </Suspense>
      {session.session.impersonatedBy && (
        <div className="border-sidebar-primary pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-30 overflow-hidden border-4" />
      )}
      <CreateOrgProvider>
        <TerminalThemeContext
          value={{
            value: terminalTheme,
            setter: setTerminalTheme,
          }}
        >
          <Outlet />
        </TerminalThemeContext>
      </CreateOrgProvider>
    </>
  );
}
