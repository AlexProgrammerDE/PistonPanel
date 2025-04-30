import { createFileRoute } from '@tanstack/react-router';
import InstancePageLayout from '@/components/nav/instance-page-layout';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_dashboard/instance/$instance/meta')({
  component: MetaSettings,
});

function MetaSettings() {
  const { t } = useTranslation('common');

  return (
    <InstancePageLayout
      extraCrumbs={[
        {
          id: 'settings',
          content: t('breadcrumbs.settings'),
        },
      ]}
      pageName={t('pageName.metaSettings')}
    >
      <Content />
    </InstancePageLayout>
  );
}

function Content() {
  return (
    <div className="flex h-full w-full max-w-4xl grow flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p>TODO: Add a content.</p>
      </div>
    </div>
  );
}
