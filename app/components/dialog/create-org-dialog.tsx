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
import { authClient } from '@/auth/auth-client';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

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

const formSchema = z.object({
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
});
export type FormType = z.infer<typeof formSchema>;

function CreateOrgDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });
  const addMutation = useMutation({
    mutationFn: async (values: FormType) => {
      const promise = authClient.organization.create({
        name: values.name,
        slug: values.slug,
      });

      toast.promise(promise, {
        loading: t('dialog.createOrg.createToast.loading'),
        success: () => {
          setOpen(false);
          void navigate({
            to: '/org/$org',
            params: { org: values.slug },
          });
          return t('dialog.createOrg.createToast.success');
        },
        error: (e) => {
          console.error(e);
          return t('dialog.createOrg.createToast.error');
        },
      });

      return promise;
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
            <CredenzaBody className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('dialog.createOrg.form.name.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder={t(
                          'dialog.createOrg.form.name.placeholder',
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('dialog.createOrg.form.name.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('dialog.createOrg.form.slug.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder={t(
                          'dialog.createOrg.form.slug.placeholder',
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('dialog.createOrg.form.slug.description')}
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
