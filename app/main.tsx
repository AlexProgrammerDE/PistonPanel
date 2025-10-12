import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRouter as createTanStackRouter,
  deepEqual,
  RouterProvider,
} from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { ErrorComponent } from "@/components/error-component";
import { LoadingComponent } from "@/components/loading-component";
import { NotFoundComponent } from "@/components/not-found-component";
import { routeTree } from "./routeTree.gen";
import "@/lib/i18n";
import {
  httpBatchStreamLink,
  httpSubscriptionLink,
  loggerLink,
  retryLink,
  splitLink,
} from "@trpc/client";
import { StrictMode } from "react";
import { trpc } from "@/lib/trpc";

export function createRouter() {
  const trpcClient = trpc.createClient({
    links: [
      loggerLink(),
      retryLink({
        retry: (opts) => {
          const code = opts.error.data?.code;
          if (!code) {
            console.error("No error code found, retrying", opts);
            return true;
          }

          if (code === "UNAUTHORIZED" || code === "FORBIDDEN") {
            console.log("Retrying due to 401/403 error");
            return true;
          }

          return false;
        },
      }),
      splitLink({
        condition: (op) => op.type === "subscription",
        true: httpSubscriptionLink({
          url: "/api/trpc",
        }),
        false: httpBatchStreamLink({
          url: "/api/trpc",
        }),
      }),
    ],
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Retries on an initial load failure
        retry: 5,
        structuralSharing: (prev: unknown, next: unknown) =>
          deepEqual(prev, next) ? prev : next,
      },
    },
  });

  broadcastQueryClient({
    queryClient,
    broadcastChannel: "pistonpanel",
  });

  // noinspection JSUnusedGlobalSymbols
  return createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    scrollRestorationBehavior: "auto",
    defaultErrorComponent: ErrorComponent,
    defaultPendingComponent: LoadingComponent,
    defaultNotFoundComponent: NotFoundComponent,
    defaultStructuralSharing: true,
    context: { queryClient },
    Wrap: ({ children }) => (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    ),
  });
}

const router = createRouter();

declare module "@tanstack/react-router" {
  // noinspection JSUnusedGlobalSymbols
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

// Render the app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
