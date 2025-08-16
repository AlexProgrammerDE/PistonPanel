import { createFileRoute } from '@tanstack/react-router';
import {
  AccountView,
  accountViewPaths,
  authLocalization,
  getViewByPath,
} from '@daveyplate/better-auth-ui';
import UserPageLayout from '@/components/nav/user/user-page-layout';

export const Route = createFileRoute('/_dashboard/_user/$pathname')({
  component: Console,
});

function Console() {
  const { pathname } = Route.useParams();
  const viewName = getViewByPath(accountViewPaths, pathname);

  return (
    <UserPageLayout
      showUserCrumb={true}
      pageName={authLocalization[viewName || 'SETTINGS']}
    >
      <Content />
    </UserPageLayout>
  );
}

function Content() {
  const { pathname } = Route.useParams();

  return (
    <div className="container h-full w-full grow">
      <AccountView hideNav pathname={pathname} />
    </div>
  );
}
