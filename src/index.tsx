import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashHistory,
  createRouter,
  deepEqual,
  Link,
  RouterProvider,
  useRouter,
} from '@tanstack/react-router';
import '@/lib/i18n';
import { routeTree } from './routeTree.gen';
import { ErrorComponent } from '@/components/error-component';
import { LoadingComponent } from '@/components/loading-component';
import { NotFoundComponent } from '@/components/not-found-component';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental';
import { PostHogProvider } from 'posthog-js/react';
import { authClient } from '@/lib/auth';
import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack';
import { AuthUIProviderTanstack } from '@daveyplate/better-auth-ui/tanstack';

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
    const router = useRouter();

    return (
      <QueryClientProvider client={queryClient}>
        <AuthQueryProvider>
          <AuthUIProviderTanstack
            authClient={authClient}
            navigate={(href) => void router.navigate({ href })}
            replace={(href) => void router.navigate({ href, replace: true })}
            onSessionChange={() => void router.invalidate()}
            providers={['google', 'microsoft', 'apple']}
            magicLink
            passkey
            credentials={false}
            signUp={false}
            twoFactor={['otp', 'totp']}
            settingsURL="/user/settings"
            Link={({ href, ...props }) => <Link to={href} {...props} />}
          >
            {children}
          </AuthUIProviderTanstack>
        </AuthQueryProvider>
      </QueryClientProvider>
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
