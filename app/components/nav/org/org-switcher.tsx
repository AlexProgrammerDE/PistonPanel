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
import { Link, useNavigate, useRouteContext } from '@tanstack/react-router';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import DynamicIcon from '@/components/dynamic-icon';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateOrgContext } from '@/components/dialog/create-org-dialog';
import { useGlobalPermission } from '@/hooks/use-global-permission';
import { authClient } from '@/auth/auth-client';
import { toast } from 'sonner';

function SidebarOrgButton() {
  const orgInfoQueryOptions = useRouteContext({
    from: '/_dashboard/org/$org',
    select: (context) => context.orgInfoQueryOptions,
  });
  const { data: orgInfo } = useSuspenseQuery(orgInfoQueryOptions);

  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className="data-[slot=sidebar-menu-button]:!p-1.5"
        tooltip={orgInfo.name}
      >
        <div>
          <DynamicIcon name={orgInfo.logo ?? ''} className="size-5" />
        </div>
        <span className="max-w-64 truncate text-base font-semibold">
          {orgInfo.name}
        </span>
        <ChevronsUpDownIcon className="ml-auto" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );
}

function SidebarOrgButtonSkeleton() {
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

function OrgList() {
  const { data: orgList } = authClient.useListOrganizations();
  if (orgList === null) {
    return null;
  }

  return (
    <>
      {orgList.map((org, index) => {
        return (
          <DropdownMenuItem key={org.id} asChild>
            <Link to="/org/$org" params={{ org: org.slug }}>
              <DynamicIcon name={org.logo ?? ''} className="size-4 shrink-0" />
              {org.name}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

function OrgListSkeleton() {
  return (
    <>
      <DropdownMenuItem>
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-3 w-32" />
      </DropdownMenuItem>
    </>
  );
}

export function OrgSwitcher() {
  const { t } = useTranslation('common');
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <Suspense fallback={<SidebarOrgButtonSkeleton />}>
            <SidebarOrgButton />
          </Suspense>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t('orgSidebar.orgsGroup')}
            </DropdownMenuLabel>
            <Suspense fallback={<OrgListSkeleton />}>
              <OrgList />
            </Suspense>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/">
                <HomeIcon className="size-4" />
                {t('orgSidebar.backToDashboard')}
              </Link>
            </DropdownMenuItem>
            <Suspense>
              <CreateOrgButton />
            </Suspense>
            <DropdownMenuSeparator />
            <Suspense>
              <DeleteOrgButton />
            </Suspense>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function CreateOrgButton() {
  const { t } = useTranslation('common');
  const { openCreateOrg } = use(CreateOrgContext);
  const createOrgPermission = useGlobalPermission({
    organization: ['create'],
  });

  if (!createOrgPermission) {
    return null;
  }

  return (
    <DropdownMenuItem onClick={openCreateOrg}>
      <PlusIcon className="size-4" />
      {t('orgSidebar.createOrg')}
    </DropdownMenuItem>
  );
}

function DeleteOrgButton() {
  const { t } = useTranslation('common');
  const orgInfoQueryOptions = useRouteContext({
    from: '/_dashboard/org/$org',
    select: (context) => context.orgInfoQueryOptions,
  });
  const { data: orgInfo } = useSuspenseQuery(orgInfoQueryOptions);
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const promise = authClient.organization.delete({
        organizationId: orgInfo.id,
      });
      toast.promise(promise, {
        loading: t('orgSidebar.deleteToast.loading'),
        success: t('orgSidebar.deleteToast.success'),
        error: (e) => {
          console.error(e);
          return t('orgSidebar.deleteToast.error');
        },
      });

      return promise;
    },
  });

  return (
    <DropdownMenuItem
      onClick={() => {
        deleteMutation.mutate();
        void navigate({
          to: '/',
        });
      }}
    >
      <MinusIcon className="size-4" />
      {t('orgSidebar.deleteOrg')}
    </DropdownMenuItem>
  );
}
