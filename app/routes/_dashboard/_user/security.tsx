import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import UserPageLayout from '@/components/nav/user/user-page-layout';
import { SecuritySettingsCards } from '@daveyplate/better-auth-ui';

export const Route = createFileRoute('/_dashboard/_user/security')({
  component: UserSettings,
});

function UserSettings() {
  const { t } = useTranslation('common');

  return (
    <UserPageLayout showUserCrumb={true} pageName={t('pageName.security')}>
      <Content />
    </UserPageLayout>
  );
}

function Content() {
  return (
    <div className="container flex h-full w-full grow flex-col gap-4">
      <SecuritySettingsCards />
    </div>
  );
}
