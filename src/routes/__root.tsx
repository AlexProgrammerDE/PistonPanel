import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from '@tanstack/react-router';
import '../App.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getTerminalTheme } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TerminalThemeContext } from '@/components/providers/terminal-theme-context';
import { AboutProvider } from '@/components/dialog/about-dialog';

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
  const [terminalTheme, setTerminalTheme] = useState(getTerminalTheme());

  return (
    <>
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
            <div vaul-drawer-wrapper="" className="flex h-dvh w-dvw flex-col">
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
    </>
  );
}
