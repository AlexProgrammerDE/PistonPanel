import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { ColumnDef, Row, Table as ReactTable } from '@tanstack/react-table';
import { toast } from 'sonner';
import {
  LogOutIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  VenetianMaskIcon,
} from 'lucide-react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import {
  SelectAllHeader,
  SelectRowHeader,
} from '@/components/data-table-selects';
import UserPageLayout from '@/components/nav/user/user-page-layout';
import { UserAvatar } from '@/components/user-avatar';
import { ManageUserDialog } from '@/components/dialog/manage-user-dialog';
import { runAsync } from '@/lib/utils';
import { SFTimeAgo } from '@/components/sf-timeago';
import { CopyInfoButton } from '@/components/info-buttons';
import { AppUser, authClient } from '@/auth/auth-client';

export const Route = createFileRoute('/_dashboard/_user/admin/users')({
  component: Users,
});

const columns: ColumnDef<AppUser>[] = [
  {
    id: 'select',
    header: SelectAllHeader,
    cell: SelectRowHeader,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: () => <Trans i18nKey="admin:users.table.username" />,
    cell: ({ row }) => (
      <div className="flex flex-row items-center justify-start gap-2">
        <UserAvatar
          username={row.original.name ?? ''}
          email={row.original.email}
          className="size-8"
        />
        <span className="max-w-64 truncate">{row.original.name}</span>
        <CopyInfoButton value={row.original.id} />
      </div>
    ),
    sortingFn: 'fuzzySort',
  },
  {
    accessorKey: 'email',
    header: () => <Trans i18nKey="admin:users.table.email" />,
    sortingFn: 'fuzzySort',
  },
  {
    accessorFn: (row) => row.role,
    accessorKey: 'role',
    header: () => <Trans i18nKey="admin:users.table.role" />,
    sortingFn: 'fuzzySort',
  },
  {
    accessorFn: (row) => row.createdAt,
    accessorKey: 'createdAt',
    header: () => <Trans i18nKey="admin:users.table.createdAt" />,
    cell: ({ row }) => <SFTimeAgo date={row.original.createdAt} />,
    enableGlobalFilter: false,
    sortingFn: 'datetime',
    filterFn: 'isWithinRange',
  },
  {
    id: 'actions',
    header: () => <Trans i18nKey="admin:users.table.actions" />,
    cell: ({ row }) => (
      <div className="flex flex-row gap-2">
        <UpdateUserButton row={row} />
        <ImpersonateUserButton row={row} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

function UpdateUserButton(props: { row: Row<AppUser> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        disabled={!props.row.getCanSelect()}
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <PencilIcon />
      </Button>
      <ManageUserDialog
        mode="edit"
        user={props.row.original}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

function ImpersonateUserButton(props: { row: Row<AppUser> }) {
  const navigate = useNavigate();
  return (
    <>
      <Button
        disabled={!props.row.getCanSelect()}
        variant="secondary"
        size="sm"
        onClick={() => {
          runAsync(async () => {
            await authClient.admin.impersonateUser({
              userId: props.row.original.id,
              fetchOptions: {
                onSuccess: async () => {
                  await navigate({
                    to: '/',
                    replace: true,
                    reloadDocument: true,
                  });
                },
              },
            });
          });
        }}
      >
        <VenetianMaskIcon />
      </Button>
    </>
  );
}

function ExtraHeader(props: { table: ReactTable<AppUser> }) {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const { usersQueryOptions } = Route.useRouteContext();
  const { mutateAsync: deleteUsersMutation } = useMutation({
    mutationFn: async (user: AppUser[]) => {
      for (const u of user) {
        await authClient.admin.removeUser({
          userId: u.id,
        });
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersQueryOptions.queryKey,
      });
    },
  });
  const { mutateAsync: invalidateUsersMutation } = useMutation({
    mutationFn: async (user: AppUser[]) => {
      for (const u of user) {
        await authClient.admin.revokeUserSessions({
          userId: u.id,
        });
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersQueryOptions.queryKey,
      });
    },
  });

  return (
    <>
      <Button variant="outline" onClick={() => setCreateOpen(true)}>
        <PlusIcon className="h-4 w-4" />
      </Button>
      <ManageUserDialog mode="add" open={createOpen} setOpen={setCreateOpen} />
      <Button
        variant="outline"
        disabled={props.table.getFilteredSelectedRowModel().rows.length === 0}
        onClick={() => {
          const selectedRows = props.table
            .getFilteredSelectedRowModel()
            .rows.map((r) => r.original);

          toast.promise(deleteUsersMutation(selectedRows), {
            loading: t('users.removeToast.loading'),
            success: t('users.removeToast.success'),
            error: (e) => {
              console.error(e);
              return t('users.removeToast.error');
            },
          });
        }}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        disabled={props.table.getFilteredSelectedRowModel().rows.length === 0}
        onClick={() => {
          const selectedRows = props.table
            .getFilteredSelectedRowModel()
            .rows.map((r) => r.original);

          toast.promise(invalidateUsersMutation(selectedRows), {
            loading: t('users.invalidateToast.loading'),
            success: t('users.invalidateToast.success'),
            error: (e) => {
              console.error(e);
              return t('users.invalidateToast.error');
            },
          });
        }}
      >
        <LogOutIcon className="h-4 w-4" />
      </Button>
    </>
  );
}

function Users() {
  const { t } = useTranslation('common');

  return (
    <UserPageLayout
      showUserCrumb={false}
      extraCrumbs={[
        {
          id: 'settings',
          content: t('breadcrumbs.settings'),
        },
      ]}
      pageName={t('pageName.users')}
    >
      <Content />
    </UserPageLayout>
  );
}

function Content() {
  const { t } = useTranslation('common');
  const { usersQueryOptions, clientDataQueryOptions } = Route.useRouteContext();
  const { data: clientInfo } = useSuspenseQuery(clientDataQueryOptions);
  const { data: userList } = useSuspenseQuery(usersQueryOptions);

  return (
    <div className="flex h-full w-full max-w-4xl grow flex-col gap-4">
      <DataTable
        filterPlaceholder={t('admin:users.filterPlaceholder')}
        columns={columns}
        data={userList}
        extraHeader={ExtraHeader}
        enableRowSelection={(row) => row.original.id !== clientInfo.user.id}
      />
    </div>
  );
}
