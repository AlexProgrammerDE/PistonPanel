import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import OrgPageLayout from '@/components/nav/org/org-page-layout';

export const Route = createFileRoute('/_dashboard/org/$org/audit-log')({
  beforeLoad: (props) => {
    const { org } = props.params;
    const auditLogQueryOptions = queryOptions({
      queryKey: ['org-audit-log', org],
      queryFn: () => {
        return {
          entry: [],
        };
      },
      refetchInterval: 3_000,
    });
    props.abortController.signal.addEventListener('abort', () => {
      void props.context.queryClient.cancelQueries({
        queryKey: auditLogQueryOptions.queryKey,
      });
    });
    return {
      auditLogQueryOptions,
    };
  },
  loader: (props) => {
    void props.context.queryClient.prefetchQuery(
      props.context.auditLogQueryOptions,
    );
  },
  component: AuditLog,
});

function getPreviousMonthDate(date: Date | undefined): Date | undefined {
  if (!date) {
    return undefined;
  }

  const prevMonthDate = new Date(date);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  return prevMonthDate;
}

function AuditLog() {
  const { t } = useTranslation('common');

  return (
    <OrgPageLayout
      extraCrumbs={[
        {
          id: 'management',
          content: t('breadcrumbs.management'),
        },
      ]}
      pageName={t('pageName.audit-log')}
    >
      <Content />
    </OrgPageLayout>
  );
}

function Content() {
  const { t } = useTranslation('common');
  const { auditLogQueryOptions } = Route.useRouteContext();
  const { data: auditLog } = useSuspenseQuery(auditLogQueryOptions);

  return (
    <div className="flex h-full w-full max-w-4xl grow flex-col gap-4"></div>
  );
}
