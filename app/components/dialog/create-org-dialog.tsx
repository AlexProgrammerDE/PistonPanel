import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '../ui/credenza';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { createContext, ReactNode, useState } from 'react';

export const CreateOrgContext = createContext<{
  openCreateOrg: () => void;
}>(null as never);

export function CreateOrgProvider(props: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateOrgContext
        value={{
          openCreateOrg: () => {
            setOpen(true);
          },
        }}
      >
        {props.children}
      </CreateOrgContext>
      <CreateOrgDialog open={open} setOpen={setOpen} />
    </>
  );
}

export type FormType = {
  friendlyName: string;
};

function CreateOrgDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation('common');
  const formSchema = z.object({
    friendlyName: z
      .string()
      .min(3, t('dialog.createOrg.form.friendlyName.min'))
      .max(32, t('dialog.createOrg.form.friendlyName.max'))
      .regex(/^[a-zA-Z0-9 ]+$/, t('dialog.createOrg.form.friendlyName.regex')),
  });
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      friendlyName: '',
    },
  });
  const addMutation = useMutation({
    mutationFn: async (values: FormType) => {
      //toast.promise(promise, {
      //  loading: t('dialog.createOrg.createToast.loading'),
      //  success: (r) => {
      //    setOpen(false);
      //    void navigate({
      //      to: '/org/$org',
      //      params: { org: r.id },
      //    });
      //    return t('dialog.createOrg.createToast.success');
      //  },
      //  error: (e) => {
      //    console.error(e);
      //    return t('dialog.createOrg.createToast.error');
      //  },
      //});
      //
      //return promise;
    },
  });

  return (
    <Form {...form}>
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent className="pb-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) =>
              void form.handleSubmit((data) => addMutation.mutate(data))(e)
            }
          >
            <CredenzaHeader>
              <CredenzaTitle>{t('dialog.createOrg.title')}</CredenzaTitle>
              <CredenzaDescription>
                {t('dialog.createOrg.description')}
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>
              <FormField
                control={form.control}
                name="friendlyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('dialog.createOrg.form.friendlyName.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder={t(
                          'dialog.createOrg.form.friendlyName.placeholder',
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('dialog.createOrg.form.friendlyName.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CredenzaBody>
            <CredenzaFooter className="justify-between">
              <CredenzaClose asChild>
                <Button variant="outline">
                  {t('dialog.createOrg.form.cancel')}
                </Button>
              </CredenzaClose>
              <Button type="submit">{t('dialog.createOrg.form.create')}</Button>
            </CredenzaFooter>
          </form>
        </CredenzaContent>
      </Credenza>
    </Form>
  );
}
