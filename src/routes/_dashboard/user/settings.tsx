import { createFileRoute } from '@tanstack/react-router';
import { use } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { TransportContext } from '@/components/providers/transport-context';
import {
  ComponentTitle,
  GenericEntryComponent,
} from '@/components/settings-page';
import {
  GlobalPermission,
  StringSetting_InputType,
} from '@/generated/pistonpanel/common';
import { JsonValue } from '@protobuf-ts/runtime/build/types/json-typings';
import {
  hasGlobalPermission,
  setSelfEmail,
  setSelfUsername,
} from '@/lib/utils';
import UserPageLayout from '@/components/nav/user-page-layout';
import { ExternalLink } from '@/components/external-link';
import { UserAvatar } from '@/components/user-avatar';
import { Card } from '@/components/ui/card';
import {
  ChangeEmailCard,
  DeleteAccountCard,
  ProvidersCard,
  SessionsCard,
  TwoFactorCard,
  UpdateUsernameCard,
} from '@daveyplate/better-auth-ui';

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
  const { clientDataQueryOptions } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const transport = use(TransportContext);
  const { data: clientInfo } = useSuspenseQuery(clientDataQueryOptions);
  const setUsernameMutation = useMutation({
    mutationFn: async (value: JsonValue) => {
      await setSelfUsername(
        value as string,
        transport,
        queryClient,
        clientDataQueryOptions.queryKey,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: clientDataQueryOptions.queryKey,
      });
    },
  });
  const setEmailMutation = useMutation({
    mutationFn: async (value: JsonValue) => {
      await setSelfEmail(
        value as string,
        transport,
        queryClient,
        clientDataQueryOptions.queryKey,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: clientDataQueryOptions.queryKey,
      });
    },
  });

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
              username={clientInfo.username}
              email={clientInfo.email}
              className="size-10"
            />
            <div className="grid flex-1 text-left text-base leading-tight">
              <span className="truncate font-semibold">
                {clientInfo.username}
              </span>
              <span className="truncate text-sm">{clientInfo.email}</span>
            </div>
          </Card>
        </div>
        <UpdateUsernameCard />
        <ChangeEmailCard />
        <SessionsCard />
        <ProvidersCard />
        <TwoFactorCard />
      </div>
    </div>
  );
}
