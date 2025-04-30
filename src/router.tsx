import {
  createRouter as createTanStackRouter,
  deepEqual,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental';
import { ErrorComponent } from '@/components/error-component';
import { LoadingComponent } from '@/components/loading-component';
import { NotFoundComponent } from '@/components/not-found-component';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import '@/lib/i18n';

export function createRouter() {
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
    broadcastChannel: 'pistonpanel',
  });

  // noinspection JSUnusedGlobalSymbols
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: 'intent',
      // Since we're using React Query, we don't want loader calls to ever be stale
      // This will ensure that the loader is always called when the route is preloaded or visited
      defaultPreloadStaleTime: 0,
      scrollRestoration: true,
      scrollRestorationBehavior: 'auto',
      defaultErrorComponent: ErrorComponent,
      defaultPendingComponent: LoadingComponent,
      defaultNotFoundComponent: NotFoundComponent,
      defaultStructuralSharing: true,
      context: { queryClient },
      Wrap: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }),
    queryClient,
  );
}

declare module '@tanstack/react-router' {
  // noinspection JSUnusedGlobalSymbols
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
