import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useLocation,
  useRouter,
} from '@tanstack/react-router';
import '@/styles/app.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AboutProvider } from '@/components/dialog/about-dialog';
import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack';
import { AuthUIProviderTanstack } from '@daveyplate/better-auth-ui/tanstack';
import { authClient } from '@/auth/auth-client';
import { PostHogProvider } from 'posthog-js/react';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  // To make pendingComponent work on root route
  wrapInSuspense: true,
  pendingComponent: RootPending,
});

function RootPending() {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div vaul-drawer-wrapper="" className="flex h-dvh w-dvw flex-col" />
      </ThemeProvider>
    </>
  );
}

function PointerReset() {
  const location = useLocation();

  // Avoid mobile pointer events issues
  // When dropdowns were open when page is switched, sometimes the body still has pointer-events: none
  // This will reset it to auto
  useEffect(() => {
    document.body.style.pointerEvents = 'auto';
  }, [location.pathname]);

  return null;
}

function RootComponent() {
  const router = useRouter();

  return (
    <>
      <AuthQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthUIProviderTanstack
            authClient={authClient}
            navigate={(href) => void router.navigate({ href })}
            replace={(href) => void router.navigate({ href, replace: true })}
            social={{
              providers: ['google', 'microsoft', 'apple'],
            }}
            magicLink
            emailOTP
            oneTap
            emailVerification
            changeEmail
            passkey
            deleteUser={{
              verification: true,
            }}
            credentials={{
              forgotPassword: true,
              username: true,
            }}
            signUp={false}
            nameRequired
            apiKey
            optimistic
            twoFactor={['otp', 'totp']}
            settings={{
              url: '/account',
            }}
            Link={({ href, ...props }) => <Link to={href} {...props} />}
          >
            <PostHogProvider
              apiKey={import.meta.env.VITE_POSTHOG_KEY}
              options={{
                api_host: import.meta.env.VITE_POSTHOG_HOST,
              }}
            >
              <TooltipProvider delayDuration={500}>
                <div
                  vaul-drawer-wrapper=""
                  className="flex h-dvh w-dvw flex-col"
                >
                  <PointerReset />
                  <AboutProvider>
                    <Outlet />
                  </AboutProvider>
                </div>
                <Toaster richColors />
              </TooltipProvider>
              <TailwindIndicator />
            </PostHogProvider>
          </AuthUIProviderTanstack>
        </ThemeProvider>
      </AuthQueryProvider>
    </>
  );
}
