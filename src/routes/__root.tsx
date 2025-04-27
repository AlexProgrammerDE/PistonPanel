import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useLocation,
  useRouter,
} from '@tanstack/react-router';
import '../App.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { QueryClient } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AboutProvider } from '@/components/dialog/about-dialog';
import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack';
import { AuthUIProviderTanstack } from '@daveyplate/better-auth-ui/tanstack';
import { authClient } from '@/lib/auth';
import { PostHogProvider } from 'posthog-js/react';
import { useSSR } from 'react-i18next';
import { i18nStore } from '@/lib/i18n';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'PistonPanel',
      },
      {
        name: 'theme-color',
        content: '#3289BF',
      },
      {
        name: 'description',
        content: 'Frontend client for PistonPanel.',
      },
      {
        name: 'application-name',
        content: 'PistonPanel',
      },
      {
        name: 'format-detection',
        content: 'telephone=no, date=no, address=no, email=no, url=no',
      },
      {
        property: 'og:title',
        content: 'PistonPanel',
      },
      {
        property: 'og:description',
        content: 'Frontend client for PistonPanel.',
      },
      {
        property: 'og:url',
        content: 'https://app.pistonpanel.com',
      },
      {
        property: 'og:locale',
        content: 'en_US',
      },
      {
        property: 'og:image',
        content: '/logo.png',
      },
      {
        property: 'og:image:width',
        content: '512',
      },
      {
        property: 'og:image:height',
        content: '512',
      },
      {
        property: 'og:image:alt',
        content: 'PistonPanel Logo',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:title',
        content: 'PistonPanel',
      },
      {
        name: 'twitter:description',
        content: 'Frontend client for PistonPanel.',
      },
      {
        name: 'twitter:image',
        content: '/logo.png',
      },
      {
        name: 'twitter:image:width',
        content: '512',
      },
      {
        name: 'twitter:image:height',
        content: '512',
      },
      {
        name: 'twitter:image:alt',
        content: 'PistonPanel Logo',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        type: 'image/x-icon',
        sizes: '256x256',
      },
    ],
  }),
  component: RootComponent,
  // To make pendingComponent work on root route
  wrapInSuspense: true,
  pendingComponent: RootPending,
});

function RootPending() {
  return (
    <RootDocument>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div vaul-drawer-wrapper="" className="flex h-dvh w-dvw flex-col" />
      </ThemeProvider>
    </RootDocument>
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
    <RootDocument>
      <AuthQueryProvider>
        <AuthUIProviderTanstack
          authClient={authClient}
          navigate={(href) => void router.navigate({ href })}
          replace={(href) => void router.navigate({ href, replace: true })}
          providers={['google', 'microsoft', 'apple']}
          magicLink
          passkey
          credentials={false}
          signUp={false}
          twoFactor={['otp', 'totp']}
          settingsURL="/user/settings"
          Link={({ href, ...props }) => <Link to={href} {...props} />}
        >
          <PostHogProvider
            apiKey={import.meta.env.VITE_POSTHOG_KEY}
            options={{
              api_host: import.meta.env.VITE_POSTHOG_HOST,
            }}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
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
            </ThemeProvider>
            <TailwindIndicator />
          </PostHogProvider>
        </AuthUIProviderTanstack>
      </AuthQueryProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  // noinspection HtmlRequiredTitleElement
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
