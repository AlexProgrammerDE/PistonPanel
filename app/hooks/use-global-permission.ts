import { useSuspenseQuery } from '@tanstack/react-query';
import { authClient } from '@/auth/auth-client';
import { useRouteContext } from '@tanstack/react-router';

export function useGlobalPermission(
  input: Parameters<
    typeof authClient.admin.checkRolePermission
  >[0]['permissions'],
) {
  const clientDataQueryOptions = useRouteContext({
    from: '/_dashboard',
    select: (context) => context.clientDataQueryOptions,
  });
  const { data: session } = useSuspenseQuery(clientDataQueryOptions);

  return authClient.admin.checkRolePermission({
    permissions: input as never,
    role: (session.user.role ?? 'user') as 'admin' | 'user',
  });
}
