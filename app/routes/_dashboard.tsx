import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import { authClient } from "@/auth/auth-client";
import { TerminalThemeContext } from "@/components/providers/terminal-theme-context";
import { getTerminalTheme } from "@/lib/utils";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async (props) => {
    const { data: session } = await authClient.getSession();
    if (session) {
      const clientDataQueryOptions = queryOptions({
        queryKey: ["client-data"],
        queryFn: async () => {
          const session = await authClient.getSession({
            fetchOptions: {
              throw: true,
            },
          });

          if (!session) {
            throw new Error("Session not found");
          }

          return session;
        },
      });
      props.abortController.signal.addEventListener("abort", () => {
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
        to: "/auth/$pathname",
        params: {
          pathname: "sign-in",
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

  useEffect(() => {
    const usedList = orgList || [];

    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const numberKey = parseInt(e.key, 10);
        if (numberKey > 0 && numberKey <= usedList.length) {
          e.preventDefault();
          void navigate({
            to: "/org/$org",
            params: { org: usedList[numberKey - 1].slug },
          });
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [orgList, navigate]);

  return null;
}

function ImpersonationBorder() {
  const { clientDataQueryOptions } = Route.useRouteContext();
  const { data: session } = useSuspenseQuery(clientDataQueryOptions);

  return (
    <>
      {session.session.impersonatedBy && (
        <div className="border-sidebar-primary pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-30 overflow-hidden border-4" />
      )}
    </>
  );
}

function DashboardLayout() {
  const [terminalTheme, setTerminalTheme] = useState(getTerminalTheme());

  return (
    <>
      <Suspense>
        <OrgSwitchKeybinds />
      </Suspense>
      <Suspense>
        <ImpersonationBorder />
      </Suspense>
      <TerminalThemeContext
        value={{
          value: terminalTheme,
          setter: setTerminalTheme,
        }}
      >
        <Outlet />
      </TerminalThemeContext>
    </>
  );
}
