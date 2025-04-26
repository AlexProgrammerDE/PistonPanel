import { createFileRoute } from '@tanstack/react-router';
import { createTransport } from '@/lib/web-rpc';
import { queryClientInstance } from '@/lib/query';
import { queryOptions } from '@tanstack/react-query';
import { ServerServiceClient } from '@/generated/pistonpanel/server.client';
import { UserListResponse } from '@/generated/pistonpanel/user';
import { UserRole } from '@/generated/pistonpanel/common';
import { UserServiceClient } from '@/generated/pistonpanel/user.client';
import { convertFromServerProto, ServerInfoQueryData } from '@/lib/types';

export const Route = createFileRoute('/_dashboard/user/admin')({
  beforeLoad: (props) => {
    const serverInfoQueryOptions = queryOptions({
      queryKey: ['server-info'],
      queryFn: async (props): Promise<ServerInfoQueryData> => {
        const transport = createTransport();
        if (transport === null) {
          return {
            config: {
              settings: [],
            },
            profile: {
              settings: {},
            },
            serverSettings: [],
          };
        }

        const serverService = new ServerServiceClient(transport);
        const result = await serverService.getServerInfo(
          {},
          {
            abort: props.signal,
          },
        );

        return {
          ...result.response,
          profile: convertFromServerProto(result.response.config!),
        };
      },
      refetchInterval: 3_000,
    });
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
      void queryClientInstance.cancelQueries({
        queryKey: serverInfoQueryOptions.queryKey,
      });
    });
    props.abortController.signal.addEventListener('abort', () => {
      void queryClientInstance.cancelQueries({
        queryKey: usersQueryOptions.queryKey,
      });
    });
    return {
      serverInfoQueryOptions,
      usersQueryOptions,
    };
  },
  loader: (props) => {
    void queryClientInstance.prefetchQuery(
      props.context.serverInfoQueryOptions,
    );
    void queryClientInstance.prefetchQuery(props.context.usersQueryOptions);
  },
});
