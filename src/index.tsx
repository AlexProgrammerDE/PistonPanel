import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashHistory,
  createRouter,
  deepEqual,
  RouterProvider,
} from '@tanstack/react-router';
import '@/lib/i18n';
import { routeTree } from './routeTree.gen';
import { ErrorComponent } from '@/components/error-component';
import { LoadingComponent } from '@/components/loading-component';
import { NotFoundComponent } from '@/components/not-found-component';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental';
import { ConvexProvider } from 'convex/react';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { PostHogProvider } from 'posthog-js/react';

const convexQueryClient = new ConvexQueryClient(import.meta.env.CONVEX_URL);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
      // Retries on an initial load failure
      retry: 5,
      structuralSharing: (prev: unknown, next: unknown) =>
        deepEqual(prev, next) ? prev : next,
    },
  },
});

convexQueryClient.connect(queryClient);

broadcastQueryClient({
  queryClient,
  broadcastChannel: 'pistonpanel',
});

// noinspection JSUnusedGlobalSymbols
const router = createRouter({
  routeTree,
  history: createHashHistory(),
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
  Wrap: ({ children }) => {
    return (
      <ConvexProvider client={convexQueryClient.convexClient}>
        <ConvexAuthProvider client={convexQueryClient.convexClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ConvexAuthProvider>
      </ConvexProvider>
    );
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  // noinspection JSUnusedGlobalSymbols
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <PostHogProvider
        apiKey={import.meta.env.PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.PUBLIC_POSTHOG_HOST,
        }}
      >
        <RouterProvider router={router} />
      </PostHogProvider>
    </StrictMode>,
  );
}
