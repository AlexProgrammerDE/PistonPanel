import { queryOptions } from '@tanstack/react-query';
import {
  InstanceAuditLogResponse,
  InstanceListResponse,
  InstanceState,
} from '@/generated/pistonpanel/instance';
import { AppUser, authClient } from '@/auth/auth-client';
import { InstanceInfoQueryData } from '@/lib/types';

export const instanceListQueryOptions = () =>
  queryOptions({
    queryKey: ['instance-list'],
    queryFn: (): InstanceListResponse => {
      return {
        instances: [
          {
            id: 'demo',
            friendlyName: 'Demo',
            icon: 'pickaxe',
            state: InstanceState.RUNNING,
            instancePermissions: [],
          },
        ],
      };
    },
    refetchInterval: 3_000,
  });

export const clientDataQueryOptions = () =>
  queryOptions({
    queryKey: ['client-data'],
    queryFn: async () => {
      return await authClient.getSession({
        fetchOptions: {
          throw: true,
        },
      });
    },
  });

export const usersQueryOptions = () =>
  queryOptions({
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

export const instanceInfoQueryOptions = (instance: string) =>
  queryOptions({
    queryKey: ['instance-info', instance],
    queryFn: (): InstanceInfoQueryData => {
      return {
        id: instance,
        friendlyName: 'Demo',
        icon: 'pickaxe',
        instancePermissions: [],
        state: InstanceState.RUNNING,
      };
    },
    refetchInterval: 3_000,
  });

export const auditLogQueryOptions = (instance: string) =>
  queryOptions({
    queryKey: ['instance-audit-log', instance],
    queryFn: (props): InstanceAuditLogResponse => {
      return {
        entry: [],
      };
    },
    refetchInterval: 3_000,
  });
