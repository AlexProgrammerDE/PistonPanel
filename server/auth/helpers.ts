import { auth } from '~/auth/auth-server';
import { TRPCError } from '@trpc/server';

export async function checkPermission(data: {
  headers: HeadersInit;
  body: Parameters<typeof auth.api.hasPermission>[0]['body'];
}): Promise<void> {
  const result = await auth.api.hasPermission({
    headers: data.headers,
    body: data.body,
  });

  if (!result) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have permission to perform this action',
    });
  }
}
