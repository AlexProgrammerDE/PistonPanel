import { AuthCard } from '@daveyplate/better-auth-ui';
import { createFileRoute } from '@tanstack/react-router';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { getLanguageName, languageEmoji } from '@/lib/utils';
import { ExternalLink } from '@/components/external-link';
import { HeartHandshakeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/auth/$pathname')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = Route.useParams();
  const { t, i18n } = useTranslation('login');
  const searchParams: Record<string, string> = Route.useSearch();

  return (
    <ScrollArea className="bg-muted h-dvh w-full px-4">
      <main className="flex min-h-dvh w-full flex-col">
        <div className="m-auto flex w-full max-w-[450px] flex-col items-center gap-6">
          <div className="flex flex-row items-center justify-center gap-2 text-center">
            <img
              className="size-8"
              width={32}
              height={32}
              src="/logo.png"
              alt={t('header.image.alt')}
            />
            <p className="font-medium tracking-wide">{t('header.title')}</p>
          </div>
          <AuthCard
            pathname={pathname}
            redirectTo={searchParams.redirect ?? '/'}
          />
          <div>
            <div className="text-muted-foreground text-center text-xs text-balance">
              <p className="mb-1">
                {t('footer.version', {
                  version: import.meta.env.APP_VERSION,
                  environment: import.meta.env.APP_ENVIRONMENT,
                })}
              </p>
            </div>
            <div className="flex flex-row justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="text-muted-foreground w-fit text-sm text-balance"
                    variant="ghost"
                  >
                    {languageEmoji(i18n.resolvedLanguage ?? i18n.language)}{' '}
                    {getLanguageName(
                      i18n.resolvedLanguage ?? i18n.language,
                      i18n.resolvedLanguage ?? i18n.language,
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{t('common:locale')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
                        {t('footer.helpTranslate')}
                      </ExternalLink>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </main>
    </ScrollArea>
  );
}
