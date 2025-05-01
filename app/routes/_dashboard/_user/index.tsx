import { createFileRoute, Link } from '@tanstack/react-router';
import * as React from 'react';
import UserPageLayout from '@/components/nav/user/user-page-layout';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SearchXIcon } from 'lucide-react';
import DynamicIcon from '@/components/dynamic-icon';
import { useTranslation } from 'react-i18next';
import { authClient } from '@/auth/auth-client';

export const Route = createFileRoute('/_dashboard/_user/')({
  component: OrgSelectPage,
});

function OrgSelectPage() {
  const { t } = useTranslation('common');

  return (
    <UserPageLayout showUserCrumb={true} pageName={t('pageName.orgs')}>
      <Content />
    </UserPageLayout>
  );
}

function Content() {
  const { t } = useTranslation('common');
  const { data: orgList } = authClient.useListOrganizations();
  if (orgList === null) {
    return null;
  }

  return (
    <>
      {orgList.length == 0 ? (
        <div className="flex size-full flex-1">
          <div className="m-auto flex flex-row gap-2">
            <SearchXIcon className="m-auto size-7" />
            <h1 className="m-auto text-xl font-bold">{t('noOrgsFound')}</h1>
          </div>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {orgList.map((org, index) => (
            <Link
              key={org.id}
              to="/org/$org"
              params={{ org: org.slug }}
              search={{}}
              className="max-h-fit w-full"
            >
              <Card className="flex w-full flex-row">
                <CardHeader className="pr-0">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-12 items-center justify-center rounded-lg">
                    <DynamicIcon
                      name={org.logo ?? ''}
                      className="size-8 shrink-0"
                    />
                  </div>
                </CardHeader>
                <CardHeader className="flex flex-row items-center">
                  <CardTitle className="max-w-64 truncate">
                    {org.name}
                  </CardTitle>
                </CardHeader>
                <CardHeader className="ml-auto">
                  <p className="mb-auo m-auto text-2xl tracking-widest opacity-60">
                    ⌘{index + 1}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
