import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "~/routers/app";

export const trpc = createTRPCReact<AppRouter>();
