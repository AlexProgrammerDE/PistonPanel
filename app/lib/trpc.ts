import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '~/api/trpc';

export const trpc = createTRPCReact<AppRouter>();
