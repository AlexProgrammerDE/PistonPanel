import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import UserPageLayout from '@/components/nav/user-page-layout';
import { ExternalLink } from '@/components/external-link';
import { UserAvatar } from '@/components/user-avatar';
import { Card } from '@/components/ui/card';
import { SettingsCards } from '@daveyplate/better-auth-ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TextInfoButton } from '@/components/info-buttons';

export const Route = createFileRoute('/_dashboard/_user/settings')({
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
  const { clientDataQueryOptions } = Route.useRouteContext();
  const { data: session } = useSuspenseQuery(clientDataQueryOptions);

  return (
    <div className="flex h-full w-full max-w-4xl grow flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex max-w-xl flex-col gap-1">
          <div className="flex w-fit flex-row items-center gap-2">
            <p>Avatar</p>
            <TextInfoButton
              value={
                <>
                  Your user avatar is based on your account email address. You
                  can change the avatar for your email address at{' '}
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
          </div>
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
