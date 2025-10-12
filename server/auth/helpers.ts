import { TRPCError } from "@trpc/server";
import { auth } from "~/auth/auth-server";

export async function checkPermission(
  headers: HeadersInit,
  permissions: NonNullable<
    Parameters<typeof auth.api.hasPermission>[0]["body"]["permissions"]
  >,
  organizationId: string,
): Promise<void> {
  const result = await auth.api.hasPermission({
    headers,
    body: {
      permissions,
      organizationId,
    },
  });

  if (!result) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action",
    });
  }
}
