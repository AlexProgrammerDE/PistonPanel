import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  BugIcon,
  LoaderCircleIcon,
  LogOutIcon,
  RotateCwIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { authClient } from "@/auth/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { runAsync } from "@/lib/utils";

export function ErrorComponent({ error }: { error: Error }) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const router = useRouter();
  const [revalidating, setRevalidating] = useState(false);

  const revalidate = useCallback(() => {
    setRevalidating(true);
    void router.invalidate().finally(() => {
      setRevalidating(false);
    });
  }, [router]);

  useEffect(() => {
    const interval = setInterval(revalidate, 1000 * 5);

    return () => {
      clearInterval(interval);
    };
  }, [revalidate]);

  return (
    <div className="flex size-full grow">
      <Card className="m-auto flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="fle-row flex gap-1 text-2xl font-bold">
            <BugIcon className="h-8" />
            {t("error.page.title")}
          </CardTitle>
          <CardDescription>{t("error.page.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="max-w-2xl truncate text-red-500">{error.message}</p>
        </CardContent>
        <CardFooter className="flex flex-row gap-2">
          <Button
            className="w-fit"
            onClick={() =>
              runAsync(async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: async () => {
                      await navigate({
                        to: "/auth/$pathname",
                        params: {
                          pathname: "sign-in",
                        },
                        replace: true,
                      });
                    },
                  },
                });
              })
            }
          >
            <LogOutIcon className="h-4" />
            {t("error.page.logOut")}
          </Button>
          <Button onClick={revalidate}>
            {revalidating ? (
              <LoaderCircleIcon className="h-4 animate-spin" />
            ) : (
              <RotateCwIcon className="h-4" />
            )}
            {t("error.page.reloadPage")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
