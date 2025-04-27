import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useLocation,
} from '@tanstack/react-router';
import '../App.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query';
import { memo, ReactNode, useEffect, useState } from 'react';
import { getTerminalTheme } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TerminalThemeContext } from '@/components/providers/terminal-theme-context';
import { AptabaseProvider, useAptabase } from '@aptabase/react';
import { AboutProvider } from '@/components/dialog/about-dialog';

export const Route = createRootRoute({
  ssr: false,
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

const AppStartedEvent = memo(() => {
  const { trackEvent } = useAptabase();
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    if (!appLoaded) {
      void trackEvent('app_loaded');
      setAppLoaded(true);
    }
  }, [appLoaded, trackEvent]);

  return null;
});

function RootComponent() {
  const [terminalTheme, setTerminalTheme] = useState(getTerminalTheme());

  return (
    <RootDocument>
      <AptabaseProvider
        appKey="A-SH-6467566517"
        options={{
          apiUrl: 'https://aptabase.pistonmaster.net/api/v0/event',
          appVersion: APP_VERSION,
        }}
      >
        <AppStartedEvent />
        <QueryClientProvider client={queryClientInstance}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider delayDuration={500}>
              <TerminalThemeContext
                value={{
                  value: terminalTheme,
                  setter: setTerminalTheme,
                }}
              >
                <div
                  vaul-drawer-wrapper=""
                  className="flex h-dvh w-dvw flex-col"
                >
                  <PointerReset />
                  <AboutProvider>
                    <Outlet />
                  </AboutProvider>
                </div>
              </TerminalThemeContext>
              <Toaster richColors />
            </TooltipProvider>
          </ThemeProvider>
          <TailwindIndicator />
        </QueryClientProvider>
      </AptabaseProvider>
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
