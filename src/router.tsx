import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import '@/lib/i18n';
import { routeTree } from './routeTree.gen';
import { ErrorComponent } from '@/components/error-component';
import { LoadingComponent } from '@/components/loading-component';
import { NotFoundComponent } from '@/components/not-found-component';

export function createRouter() {
  return createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 10_000,
    scrollRestoration: true,
    scrollRestorationBehavior: 'auto',
    defaultErrorComponent: ErrorComponent,
    defaultPendingComponent: LoadingComponent,
    defaultNotFoundComponent: NotFoundComponent,
    defaultStructuralSharing: true,
  });
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
