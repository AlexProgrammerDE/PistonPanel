import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ComponentTitle } from '@/components/settings-page';
import UserPageLayout from '@/components/nav/user-page-layout';
import { ExternalLink } from '@/components/external-link';
import { UserAvatar } from '@/components/user-avatar';
import { Card } from '@/components/ui/card';
import { SettingsCards } from '@daveyplate/better-auth-ui';

export const Route = createFileRoute('/_dashboard/user/settings')({
  component: UserSettings,
});

function UserSettings() {
  const { t } = useTranslation('common');

  return (
    <UserPageLayout showUserCrumb={true} pageName={t('pageName.settings')}>
      <Content />
    </UserPageLayout>
  );
}

function Content() {
  const { session } = Route.useRouteContext();

  return (
    <div className="flex h-full w-full max-w-4xl grow flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex max-w-xl flex-col gap-1">
          <ComponentTitle
            title="Avatar"
            description={
              <>
                Your user avatar is based on your account email address. You can
                change the avatar for your email address at{' '}
                <ExternalLink
                  className="font-semibold underline-offset-4 hover:underline"
                  href="https://gravatar.com"
                >
                  Gravatar
                </ExternalLink>
                .
              </>
            }
          />
          <Card className="flex w-fit items-center gap-2 p-3 text-left text-base">
            <UserAvatar
              username={session.user.username ?? ''}
              email={session.user.email}
              className="size-10"
            />
            <div className="grid flex-1 text-left text-base leading-tight">
              <span className="truncate font-semibold">
                {session.user.username}
              </span>
              <span className="truncate text-sm">{session.user.email}</span>
            </div>
          </Card>
        </div>
        <SettingsCards />
      </div>
    </div>
  );
}
