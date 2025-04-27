import { createFileRoute } from '@tanstack/react-router';
import { RedirectToSignIn } from '@daveyplate/better-auth-ui';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <RedirectToSignIn />;
}
