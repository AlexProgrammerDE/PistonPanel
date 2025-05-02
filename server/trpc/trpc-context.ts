import { auth } from '~/auth/auth-server';

export async function createContext(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  return {
    headers: req.headers,
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
