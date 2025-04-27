import { useTranslation } from 'react-i18next';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LoaderCircleIcon,
  LogOutIcon,
  RotateCwIcon,
  SearchXIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { runAsync } from '@/lib/utils';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export function NotFoundComponent() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const router = useRouter();
  const [revalidating, setRevalidating] = useState(false);

  return (
    <div className="flex size-full grow">
      <Card className="m-auto flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="fle-row flex gap-1 text-2xl font-bold">
            <SearchXIcon className="h-8" />
            {t('notFound.page.title')}
          </CardTitle>
          <CardDescription>{t('notFound.page.description')}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-row gap-2">
          <Button
            className="w-fit"
            onClick={() => {
              runAsync(async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: async () => {
                      await navigate({
                        to: '/',
                        replace: true,
                      });
                    },
                  },
                });
              });
            }}
          >
            <LogOutIcon className="h-4" />
            {t('notFound.page.logOut')}
          </Button>
          <Button
            onClick={() => {
              setRevalidating(true);
              router
                .invalidate()
                .then(() => {
                  setRevalidating(false);
                })
                .catch(() => {
                  setRevalidating(false);
                });
            }}
          >
            {revalidating ? (
              <LoaderCircleIcon className="h-4 animate-spin" />
            ) : (
              <RotateCwIcon className="h-4" />
            )}
            {t('notFound.page.reloadPage')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
