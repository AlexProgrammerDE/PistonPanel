import { useSuspenseQuery } from '@tanstack/react-query';
import { authClient } from '@/auth/auth-client';

export function useGlobalPermission(
  input: Parameters<typeof authClient.admin.hasPermission>[0],
) {
  const { data: result } = useSuspenseQuery({
    queryKey: ['global-permission', input],
    queryFn: async () =>
      await authClient.admin.hasPermission({
        ...input,
        fetchOptions: {
          throw: true,
        },
      }),
  });

  return result.success;
}
