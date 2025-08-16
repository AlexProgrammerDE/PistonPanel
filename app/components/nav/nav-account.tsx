'use client';

import {
  ChevronsUpDown,
  CircleHelpIcon,
  HeartHandshakeIcon,
  LanguagesIcon,
  LaptopMinimalIcon,
  LogOutIcon,
  MoonIcon,
  PaintRollerIcon,
  SunIcon,
  SunMoonIcon,
  VenetianMaskIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Suspense, use } from 'react';
import {
  appUserName,
  getLanguageName,
  languageEmoji,
  runAsync,
  setTerminalTheme,
} from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { flavorEntries } from '@catppuccin/palette';
import { useTheme } from 'next-themes';
import { TerminalThemeContext } from '@/components/providers/terminal-theme-context';
import { AboutContext } from '@/components/dialog/about-dialog';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '@/components/user-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from '@/components/external-link';
import { authClient } from '@/auth/auth-client';
import { Route } from '@/routes/_dashboard';
import { useSuspenseQuery } from '@tanstack/react-query';

function SidebarAccountButton() {
  const { clientDataQueryOptions } = Route.useRouteContext();
  const { data: session } = useSuspenseQuery(clientDataQueryOptions);

  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        tooltip={`${appUserName(session.user)} | ${session.user.email}`}
      >
        <UserAvatar
          username={appUserName(session.user)}
          email={session.user.email}
          className="size-8"
        />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            {appUserName(session.user)}
          </span>
          <span className="truncate text-xs">{session.user.email}</span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );
}

function SidebarAccountButtonSkeleton() {
  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Skeleton className="relative flex size-8 h-10 w-10 shrink-0 overflow-hidden rounded-lg" />
        <div className="grid flex-1 gap-2 text-left text-sm leading-tight">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );
}

function DropdownAccountHeader() {
  const { clientDataQueryOptions } = Route.useRouteContext();
  const { data: session } = useSuspenseQuery(clientDataQueryOptions);

  return (
    <div className="flex items-center gap-2 px-1 py-1.5">
      <UserAvatar
        username={appUserName(session.user)}
        email={session.user.email}
        className="size-8"
      />
      <div className="grid flex-1">
        <span className="truncate font-semibold">
          {appUserName(session.user)}
        </span>
        <span className="truncate text-xs">{session.user.email}</span>
      </div>
    </div>
  );
}

function DropdownAccountHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Skeleton className="size-8 rounded-lg" />
      <div className="grid flex-1 gap-2 text-left text-sm leading-tight">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

function DropdownImpersonateButton() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { clientDataQueryOptions } = Route.useRouteContext();
  const { data: session } = useSuspenseQuery(clientDataQueryOptions);

  if (!session.session.impersonatedBy) {
    return null;
  }

  return (
    <DropdownMenuItem
      onClick={() => {
        runAsync(async () => {
          await authClient.admin.stopImpersonating({
            fetchOptions: {
              onSuccess: async () => {
                await navigate({
                  to: '/',
                  replace: true,
                  reloadDocument: true,
                });
              },
            },
          });
        });
      }}
    >
      <VenetianMaskIcon />
      {t('userSidebar.stopImpersonating')}
    </DropdownMenuItem>
  );
}

export function NavAccount() {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const terminalTheme = use(TerminalThemeContext);
  const { openAbout } = use(AboutContext);
  const { theme, setTheme } = useTheme();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <Suspense fallback={<SidebarAccountButtonSkeleton />}>
            <SidebarAccountButton />
          </Suspense>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <Suspense fallback={<DropdownAccountHeaderSkeleton />}>
                <DropdownAccountHeader />
              </Suspense>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <PaintRollerIcon />
                  {t('userSidebar.theme.title')}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={theme}
                      onValueChange={(e) => setTheme(e)}
                    >
                      <DropdownMenuRadioItem value="system">
                        <SunMoonIcon className="mr-1 h-4" />
                        {t('userSidebar.theme.system')}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        <MoonIcon className="mr-1 h-4" />
                        {t('userSidebar.theme.dark')}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="light">
                        <SunIcon className="mr-1 h-4" />
                        {t('userSidebar.theme.light')}
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <LaptopMinimalIcon />
                  {t('userSidebar.terminal.title')}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={terminalTheme.value}
                      onValueChange={(e) => {
                        setTerminalTheme(e);
                        terminalTheme.setter(e);
                      }}
                    >
                      {flavorEntries.map((entry) => (
                        <DropdownMenuRadioItem key={entry[0]} value={entry[0]}>
                          {entry[1].emoji} {entry[1].name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <LanguagesIcon />
                  {t('locale')}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={i18n.resolvedLanguage ?? i18n.language}
                      onValueChange={(lang) => void i18n.changeLanguage(lang)}
                      className="grid grid-cols-1 md:grid-cols-2"
                    >
                      {(i18n.options.supportedLngs
                        ? i18n.options.supportedLngs
                        : []
                      )
                        .filter((lang) => lang !== 'cimode')
                        .map((lang) => (
                          <DropdownMenuRadioItem key={lang} value={lang}>
                            {languageEmoji(lang)} {getLanguageName(lang, lang)}
                          </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <ExternalLink href="https://translate.pistonpanel.com">
                          <HeartHandshakeIcon />
                          {t('userSidebar.helpTranslate')}
                        </ExternalLink>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={openAbout}>
                <CircleHelpIcon />
                {t('userSidebar.about')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Suspense>
                <DropdownImpersonateButton />
              </Suspense>
              <DropdownMenuItem
                onClick={() => {
                  const disconnect = async () => {
                    await authClient.signOut({
                      fetchOptions: {
                        onSuccess: async () => {
                          await navigate({
                            to: '/auth/$pathname',
                            params: {
                              pathname: 'sign-in',
                            },
                            replace: true,
                          });
                        },
                      },
                    });
                  };
                  toast.promise(disconnect(), {
                    loading: t('userSidebar.logOutToast.loading'),
                    success: t('userSidebar.logOutToast.success'),
                    error: (e) => {
                      console.error(e);
                      return t('userSidebar.logOutToast.error');
                    },
                  });
                }}
              >
                <LogOutIcon />
                {t('userSidebar.logOut')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
