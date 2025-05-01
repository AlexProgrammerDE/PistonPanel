import { createFileRoute } from '@tanstack/react-router';
import OrgPageLayout from '@/components/nav/org/org-page-layout';
import { useTranslation } from 'react-i18next';
import { useSuspenseQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/_dashboard/org/$org/servers')({
  component: Console,
});

function Console() {
  const { t } = useTranslation('common');

  return (
    <OrgPageLayout
      extraCrumbs={[
        {
          id: 'resources',
          content: t('breadcrumbs.resources'),
        },
      ]}
      pageName={t('pageName.servers')}
    >
      <Content />
    </OrgPageLayout>
  );
}

function Content() {
  const { orgInfoQueryOptions } = Route.useRouteContext();
  const { data: orgInfo } = useSuspenseQuery(orgInfoQueryOptions);

  return (
    <div className="flex h-full w-full grow flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <h2 className="max-w-64 truncate text-xl font-semibold">
            {orgInfo.name}
          </h2>
        </div>
      </div>
    </div>
  );
}
