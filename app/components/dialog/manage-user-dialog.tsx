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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouteContext } from '@tanstack/react-router';
import {
  AppGlobalRole,
  appGlobalRoles,
  AppUser,
  authClient,
} from '@/auth/auth-client';

export type FormType = {
  name: string;
  username: string;
  email: string;
  role: AppGlobalRole;
  password: string;
};

export function ManageUserDialog({
  open,
  setOpen,
  ...props
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
} & ({ mode: 'edit'; user: AppUser } | { mode: 'add' })) {
  const usersQueryOptions = useRouteContext({
    from: '/_dashboard/_user/admin/users',
    select: (context) => context.usersQueryOptions,
  });
  const queryClient = useQueryClient();
  const { t } = useTranslation('admin');
  const formSchema = z.object({
    name: z.string().nonempty(),
    username: z.string().nonempty(),
    email: z.string().email(),
    role: z.enum(appGlobalRoles),
    password: z.string().nonempty(),
  });
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.mode === 'edit' ? props.user.name : '',
      username: props.mode === 'edit' ? props.user.username || '' : '',
      email: props.mode === 'edit' ? props.user.email : '',
      role:
        props.mode === 'edit'
          ? ((props.user.role || 'user') as AppGlobalRole)
          : 'user',
      password: '',
    },
  });
  const submitMutation = useMutation({
    mutationFn: async (values: FormType) => {
      const promise: Promise<void> =
        props.mode === 'add'
          ? authClient.admin
              .createUser({
                name: values.name,
                email: values.email,
                role: values.role,
                password: values.password,
                data: {
                  username: values.username,
                },
              })
              .then()
          : Promise.all([
              authClient.admin.setRole({
                userId: props.user.id,
                role: values.role,
              }),
              authClient.admin.setUserPassword({
                userId: props.user.id,
                newPassword: values.password,
              }),
            ]).then();
      toast.promise(promise, {
        loading:
          props.mode === 'add'
            ? t('users.addToast.loading')
            : t('users.updateToast.loading'),
        success: () => {
          setOpen(false);
          return props.mode === 'add'
            ? t('users.addToast.success')
            : t('users.updateToast.success');
        },
        error: (e) => {
          console.error(e);
          return props.mode === 'add'
            ? t('users.addToast.error')
            : t('users.updateToast.error');
        },
      });

      return promise;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersQueryOptions.queryKey,
      });
    },
  });

  return (
    <Form {...form}>
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent className="pb-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) =>
              void form.handleSubmit((data) => submitMutation.mutate(data))(e)
            }
          >
            <CredenzaHeader>
              <CredenzaTitle>
                {props.mode === 'add'
                  ? t('users.addUserDialog.title')
                  : t('users.updateUserDialog.title')}
              </CredenzaTitle>
              <CredenzaDescription>
                {props.mode === 'add'
                  ? t('users.addUserDialog.description')
                  : t('users.updateUserDialog.description')}
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('users.baseUserDialog.form.name.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        readOnly={props.mode === 'edit'}
                        autoFocus
                        placeholder={t(
                          'users.baseUserDialog.form.name.placeholder',
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('users.baseUserDialog.form.name.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('users.baseUserDialog.form.username.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        readOnly={props.mode === 'edit'}
                        autoFocus
                        placeholder={t(
                          'users.baseUserDialog.form.username.placeholder',
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('users.baseUserDialog.form.username.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('users.baseUserDialog.form.email.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        readOnly={props.mode === 'edit'}
                        placeholder={t(
                          'users.baseUserDialog.form.email.placeholder',
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('users.baseUserDialog.form.email.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('users.baseUserDialog.form.role.label')}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appGlobalRoles.map((role) => (
                          <SelectItem key={role} value={String(role)}>
                            {t(`users.baseUserDialog.form.role.${role}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t('users.baseUserDialog.form.role.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('users.baseUserDialog.form.password.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t(
                          'users.baseUserDialog.form.password.placeholder',
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('users.baseUserDialog.form.password.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CredenzaBody>
            <CredenzaFooter className="justify-between">
              <CredenzaClose asChild>
                <Button variant="outline">
                  {props.mode === 'add'
                    ? t('users.addUserDialog.form.cancel')
                    : t('users.updateUserDialog.form.cancel')}
                </Button>
              </CredenzaClose>
              <Button type="submit">
                {props.mode === 'add'
                  ? t('users.addUserDialog.form.add')
                  : t('users.updateUserDialog.form.update')}
              </Button>
            </CredenzaFooter>
          </form>
        </CredenzaContent>
      </Credenza>
    </Form>
  );
}
