import { createFileRoute } from '@tanstack/react-router';
import OrgPageLayout from '@/components/nav/org/org-page-layout';
import { useTranslation } from 'react-i18next';
import { OrganizationMembersCard } from '@daveyplate/better-auth-ui';

export const Route = createFileRoute('/_dashboard/org/$org/members')({
  component: MetaSettings,
});

function MetaSettings() {
  const { t } = useTranslation('common');

  return (
    <OrgPageLayout
      extraCrumbs={[
        {
          id: 'management',
          content: t('breadcrumbs.management'),
        },
      ]}
      pageName={t('pageName.members')}
    >
      <Content />
    </OrgPageLayout>
  );
}

function Content() {
  return (
    <div className="container flex h-full w-full grow flex-col gap-4">
      <div className="flex flex-col gap-2">
        <OrganizationMembersCard />
      </div>
    </div>
  );
}
