import { createFileRoute } from '@tanstack/react-router';
import { usersQueryOptions } from '@/lib/queries';

export const Route = createFileRoute('/_dashboard/user/admin')({
  loader: async (props) => {
    await props.context.queryClient.ensureQueryData(usersQueryOptions());
  },
});
