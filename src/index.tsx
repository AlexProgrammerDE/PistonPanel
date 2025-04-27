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
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { QueryClient } from '@tanstack/react-query';
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental';

const hashHistory = createHashHistory();

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
const router = routerWithQueryClient(
  createRouter({
    routeTree,
    history: hashHistory,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 10_000,
    scrollRestoration: true,
    scrollRestorationBehavior: 'auto',
    defaultErrorComponent: ErrorComponent,
    defaultPendingComponent: LoadingComponent,
    defaultNotFoundComponent: NotFoundComponent,
    defaultStructuralSharing: true,
    context: { queryClient },
  }),
  queryClient,
);

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
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
