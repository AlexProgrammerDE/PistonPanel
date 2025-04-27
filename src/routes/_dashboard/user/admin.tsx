import { createFileRoute } from '@tanstack/react-router';
import { createTransport } from '@/lib/web-rpc';
import { queryOptions } from '@tanstack/react-query';
import { UserListResponse } from '@/generated/pistonpanel/user';
import { UserRole } from '@/generated/pistonpanel/common';
import { UserServiceClient } from '@/generated/pistonpanel/user.client';

export const Route = createFileRoute('/_dashboard/user/admin')({
  beforeLoad: (props) => {
    const usersQueryOptions = queryOptions({
      queryKey: ['users'],
      queryFn: async (props): Promise<UserListResponse> => {
        const transport = createTransport();
        if (transport === null) {
          return {
            users: [
              {
                id: 'root',
                username: 'root',
                email: 'root@pistonpanel.com',
                role: UserRole.ADMIN,
              },
            ],
          };
        }

        const userService = new UserServiceClient(transport);
        const result = await userService.listUsers(
          {},
          {
            abort: props.signal,
          },
        );

        return result.response;
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
