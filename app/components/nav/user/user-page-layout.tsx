import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode, Suspense } from 'react';
import { BookOpenTextIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { CatchBoundary, useRouteContext } from '@tanstack/react-router';
import { ErrorComponent } from '@/components/error-component';
import { ExternalLink } from '@/components/external-link';
import { LoadingComponent } from '@/components/loading-component';
import { Skeleton } from '@/components/ui/skeleton';
import { useSuspenseQuery } from '@tanstack/react-query';
import { appUserName } from '@/lib/utils';

function UserCrumb() {
  const clientDataQueryOptions = useRouteContext({
    from: '/_dashboard',
    select: (context) => context.clientDataQueryOptions,
  });
  const { data: session } = useSuspenseQuery(clientDataQueryOptions);
  return appUserName(session.user);
}

function UserCrumbSkeleton() {
  return <Skeleton className="h-4 w-24" />;
}

export default function UserPageLayout(props: {
  children: ReactNode;
  extraCrumbs?: { id: string; content: ReactNode }[];
  pageName: ReactNode;
  showUserCrumb: boolean;
  documentationLink?: string;
}) {
  const { t } = useTranslation('common');

  const CrumbComponent = (props: { crumb: ReactNode }) => (
    <>
      <BreadcrumbItem className="hidden md:block">{props.crumb}</BreadcrumbItem>
      <BreadcrumbSeparator className="hidden md:block" />
    </>
  );

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          {props.documentationLink && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <ExternalLink href={props.documentationLink}>
                  <BookOpenTextIcon />
                  <span className="sr-only">
                    {t('userSidebar.readDocumentation')}
                  </span>
                </ExternalLink>
              </Button>
            </>
          )}
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {props.showUserCrumb && (
                <>
                  <BreadcrumbItem className="hidden max-w-64 truncate md:block">
                    <Suspense fallback={<UserCrumbSkeleton />}>
                      <UserCrumb />
                    </Suspense>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}
              {(props.extraCrumbs || []).map((crumb) => (
                <CrumbComponent crumb={crumb.content} key={crumb.id} />
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage>{props.pageName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ScrollArea className="h-[calc(100dvh-3rem)] w-full">
        <div className="flex min-h-[calc(100dvh-3rem)] w-full flex-col p-4">
          <CatchBoundary
            getResetKey={() => 'user-page-layout'}
            errorComponent={ErrorComponent}
          >
            <Suspense fallback={<LoadingComponent />}>
              {props.children}
            </Suspense>
          </CatchBoundary>
        </div>
      </ScrollArea>
    </>
  );
}
