import { createFileRoute } from '@tanstack/react-router';
import OrgPageLayout from '@/components/nav/org/org-page-layout';
import { useTranslation } from 'react-i18next';
import {
  accountViewPaths,
  authLocalization,
  getViewByPath,
  OrganizationView,
  organizationViewPaths,
} from '@daveyplate/better-auth-ui';

export const Route = createFileRoute('/_dashboard/org/$org/$pathname')({
  component: Console,
});

function Console() {
  const { pathname } = Route.useParams();
  const viewName = getViewByPath(organizationViewPaths, pathname);

  return (
    <OrgPageLayout pageName={authLocalization[viewName ?? 'SETTINGS']}>
      <Content />
    </OrgPageLayout>
  );
}

function Content() {
  const { pathname } = Route.useParams();

  return (
    <div className="h-full w-full grow">
      <OrganizationView hideNav pathname={pathname} />
    </div>
  );
}
