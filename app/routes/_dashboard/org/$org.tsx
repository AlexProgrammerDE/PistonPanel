import { CatchBoundary, createFileRoute, Outlet } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { OrgSidebar } from '@/components/nav/org/org-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorComponent } from '@/components/error-component';
import { useEffect } from 'react';
import { authClient } from '@/auth/auth-client';

export const Route = createFileRoute('/_dashboard/org/$org')({
  beforeLoad: (props) => {
    const { org } = props.params;
    const orgInfoQueryOptions = queryOptions({
      queryKey: ['org-info', org],
      queryFn: () => {
        return authClient.organization.getFullOrganization({
          query: {
            organizationSlug: org,
          },
          fetchOptions: {
            throw: true,
          },
        });
      },
      refetchInterval: 3_000,
    });
    props.abortController.signal.addEventListener('abort', () => {
      void props.context.queryClient.cancelQueries({
        queryKey: orgInfoQueryOptions.queryKey,
      });
    });
    return {
      orgInfoQueryOptions,
    };
  },
  loader: (props) => {
    void props.context.queryClient.prefetchQuery(
      props.context.orgInfoQueryOptions,
    );
  },
  component: OrgLayout,
});

function OrgLayout() {
  const { org } = Route.useParams();
  const defaultOpen = localStorage.getItem('sidebar:state') === 'true';

  useEffect(() => {
    void authClient.organization.setActive({
      organizationSlug: org,
    });
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <OrgSidebar />
      <TooltipProvider delayDuration={500}>
        <SidebarInset>
          <CatchBoundary
            getResetKey={() => 'org-layout'}
            errorComponent={ErrorComponent}
          >
            <Outlet />
          </CatchBoundary>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
