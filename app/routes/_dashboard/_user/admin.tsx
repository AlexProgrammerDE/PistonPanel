import { createFileRoute } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { AppUser, authClient } from '@/auth/auth-client';

export const Route = createFileRoute('/_dashboard/_user/admin')({
  beforeLoad: (props) => {
    const usersQueryOptions = queryOptions({
      queryKey: ['users'],
      queryFn: async (): Promise<AppUser[]> => {
        return (
          await authClient.admin.listUsers({
            query: {
              limit: Number.MAX_SAFE_INTEGER,
            },
            fetchOptions: {
              throw: true,
            },
          })
        ).users as AppUser[];
      },
      refetchInterval: 3_000,
    });
    props.abortController.signal.addEventListener('abort', () => {
      void props.context.queryClient.cancelQueries({
        queryKey: usersQueryOptions.queryKey,
      });
    });
    return {
      usersQueryOptions,
    };
  },
  loader: (props) => {
    void props.context.queryClient.prefetchQuery(
      props.context.usersQueryOptions,
    );
  },
});
