// Must be first
import "dotenv-flow/config";

import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { appRouter } from "~/routers/app";
import { createContext } from "~/trpc/trpc-context";
import { auth } from "./auth/auth-server";

const app = new Hono();

app.use(logger());
app.get("/", (c) => c.text("Hello World!"));

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => createContext(c.req.raw),
  }),
);

serve(
  {
    ...app,
    port: 8787,
    hostname: "0.0.0.0",
  },
  (info) => {
    // noinspection HttpUrlsUsage
    console.log(`Hono server started on http://${info.address}:${info.port}`);
  },
);
