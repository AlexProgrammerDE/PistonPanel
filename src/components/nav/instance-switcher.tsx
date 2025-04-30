import * as React from 'react';
import { Suspense, use } from 'react';
import {
  ChevronsUpDownIcon,
  HomeIcon,
  MinusIcon,
  PlusIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { translateInstanceState } from '@/lib/types';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { hasInstancePermission } from '@/lib/utils';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { InstanceServiceClient } from '@/generated/pistonpanel/instance.client';
import { toast } from 'sonner';
import { TransportContext } from '@/components/providers/transport-context';
import { InstancePermission } from '@/generated/pistonpanel/common';
import DynamicIcon from '@/components/dynamic-icon';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateInstanceContext } from '@/components/dialog/create-instance-dialog';
import { useGlobalPermission } from '@/hooks/use-global-permission';
import {
  instanceInfoQueryOptions,
  instanceListQueryOptions,
} from '@/lib/queries';

function SidebarInstanceButton() {
  const { i18n } = useTranslation('common');
  const { instance } = useParams({
    from: '/_dashboard/instance/$instance',
  });
  const { data: instanceInfo } = useSuspenseQuery(
    instanceInfoQueryOptions(instance),
  );

  const capitalizedState = translateInstanceState(i18n, instanceInfo.state);
  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        tooltip={`${instanceInfo.friendlyName} | ${capitalizedState}`}
      >
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <DynamicIcon name={instanceInfo.icon} className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="max-w-64 truncate font-semibold">
            {instanceInfo.friendlyName}
          </span>
          <span className="truncate text-xs">{capitalizedState}</span>
        </div>
        <ChevronsUpDownIcon className="ml-auto" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );
}

function SidebarInstanceButtonSkeleton() {
  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Skeleton className="relative flex size-8 h-10 w-10 shrink-0 overflow-hidden rounded-lg" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
        <ChevronsUpDownIcon className="ml-auto" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );
}

function InstanceList() {
  const { data: instanceList } = useSuspenseQuery(instanceListQueryOptions());

  return (
    <>
      {instanceList.instances.map((instance, index) => {
        return (
          <DropdownMenuItem key={instance.id} asChild className="gap-2 p-2">
            <Link to="/instance/$instance" params={{ instance: instance.id }}>
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <DynamicIcon name={instance.icon} className="size-4 shrink-0" />
              </div>
              {instance.friendlyName}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

function InstanceListSkeleton() {
  return (
    <>
      <DropdownMenuItem className="gap-2 p-2">
        <div className="flex size-6 items-center justify-center rounded-sm border">
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-3 w-32" />
      </DropdownMenuItem>
    </>
  );
}

export function InstanceSwitcher() {
  const { t } = useTranslation('common');
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <Suspense fallback={<SidebarInstanceButtonSkeleton />}>
            <SidebarInstanceButton />
          </Suspense>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t('instanceSidebar.instancesGroup')}
            </DropdownMenuLabel>
            <Suspense fallback={<InstanceListSkeleton />}>
              <InstanceList />
            </Suspense>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link to="/user">
                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                  <HomeIcon className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  {t('instanceSidebar.backToDashboard')}
                </div>
              </Link>
            </DropdownMenuItem>
            <Suspense>
              <CreateInstanceButton />
            </Suspense>
            <DropdownMenuSeparator />
            <Suspense>
              <DeleteInstanceButton />
            </Suspense>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function CreateInstanceButton() {
  const { t } = useTranslation('common');
  const { openCreateInstance } = use(CreateInstanceContext);
  const createInstancePermission = useGlobalPermission({
    permissions: {
      organization: ['create'],
    },
  });

  if (!createInstancePermission) {
    return null;
  }

  return (
    <DropdownMenuItem onClick={openCreateInstance} className="gap-2 p-2">
      <div className="bg-background flex size-6 items-center justify-center rounded-md border">
        <PlusIcon className="size-4" />
      </div>
      <div className="text-muted-foreground font-medium">
        {t('instanceSidebar.createInstance')}
      </div>
    </DropdownMenuItem>
  );
}

function DeleteInstanceButton() {
  const { t } = useTranslation('common');
  const transport = use(TransportContext);
  const { instance } = useParams({
    from: '/_dashboard/instance/$instance',
  });
  const { data: instanceInfo } = useSuspenseQuery(
    instanceInfoQueryOptions(instance),
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (instanceId: string) => {
      if (transport === null) {
        return;
      }

      const instanceService = new InstanceServiceClient(transport);
      const promise = instanceService
        .deleteInstance({
          id: instanceId,
        })
        .then((r) => r.response);
      toast.promise(promise, {
        loading: t('instanceSidebar.deleteToast.loading'),
        success: t('instanceSidebar.deleteToast.success'),
        error: (e) => {
          console.error(e);
          return t('instanceSidebar.deleteToast.error');
        },
      });

      return promise;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: instanceListQueryOptions().queryKey,
      });
    },
  });

  if (
    !hasInstancePermission(instanceInfo, InstancePermission.DELETE_INSTANCE)
  ) {
    return null;
  }

  return (
    <DropdownMenuItem
      onClick={() => {
        deleteMutation.mutate(instanceInfo.id);
        void navigate({
          to: '/user',
        });
      }}
      className="gap-2 p-2"
    >
      <div className="bg-background flex size-6 items-center justify-center rounded-md border">
        <MinusIcon className="size-4" />
      </div>
      <div className="text-muted-foreground font-medium">
        {t('instanceSidebar.deleteInstance')}
      </div>
    </DropdownMenuItem>
  );
}
