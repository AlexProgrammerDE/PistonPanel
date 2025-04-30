import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { DataTable, DateRange } from '@/components/data-table';
import { ColumnDef, Table as ReactTable } from '@tanstack/react-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { UserAvatar } from '@/components/user-avatar';
import {
  InstanceAuditLogResponse_AuditLogEntry,
  InstanceAuditLogResponse_AuditLogEntryType,
} from '@/generated/pistonpanel/instance';
import InstancePageLayout from '@/components/nav/instance-page-layout';
import { cn, timestampToDate } from '@/lib/utils';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useDateFnsLocale } from '@/hooks/use-date-fns-locale';
import { SFTimeAgo } from '@/components/sf-timeago';
import { auditLogQueryOptions } from '@/lib/queries';

export const Route = createFileRoute(
  '/_dashboard/instance/$instance/audit-log',
)({
  loader: async (props) => {
    await props.context.queryClient.ensureQueryData(
      auditLogQueryOptions(props.params.instance),
    );
  },
  component: AuditLog,
});

function toI18nKey(type: InstanceAuditLogResponse_AuditLogEntryType) {
  switch (type) {
    case InstanceAuditLogResponse_AuditLogEntryType.START_ATTACK:
      return 'auditLog.startedAttack';
    case InstanceAuditLogResponse_AuditLogEntryType.STOP_ATTACK:
      return 'auditLog.stoppedAttack';
    case InstanceAuditLogResponse_AuditLogEntryType.RESUME_ATTACK:
      return 'auditLog.resumedAttack';
    case InstanceAuditLogResponse_AuditLogEntryType.PAUSE_ATTACK:
      return 'auditLog.pausedAttack';
    case InstanceAuditLogResponse_AuditLogEntryType.EXECUTE_COMMAND:
      return 'auditLog.executedCommand';
  }
}

const columns: ColumnDef<InstanceAuditLogResponse_AuditLogEntry>[] = [
  {
    accessorFn: (row) => `${row.user!.username} ${row.user!.email}`,
    accessorKey: 'user',
    header: () => <Trans i18nKey="auditLog.user" />,
    cell: ({ row }) => (
      <div className="flex flex-row items-center justify-start gap-2">
        <UserAvatar
          username={row.original.user!.username}
          email={row.original.user!.email}
          className="size-8"
        />
        {row.original.user!.username}
      </div>
    ),
    sortingFn: 'fuzzySort',
  },
  {
    accessorFn: (row) =>
      i18n.t(toI18nKey(row.type), {
        data: row.data,
      }),
    accessorKey: 'type',
    header: () => <Trans i18nKey="auditLog.action" />,
    cell: ({ row }) => (
      <p>
        <Trans
          i18nKey={toI18nKey(row.original.type)}
          values={{
            data: row.original.data,
          }}
        />
      </p>
    ),
    sortingFn: 'fuzzySort',
  },
  {
    accessorFn: (row) => timestampToDate(row.timestamp!),
    accessorKey: 'timestamp',
    header: () => <Trans i18nKey="auditLog.timestamp" />,
    cell: ({ row }) => (
      <SFTimeAgo date={timestampToDate(row.original.timestamp!)} />
    ),
    enableGlobalFilter: false,
    sortingFn: 'datetime',
    filterFn: 'isWithinRange',
  },
];

function getPreviousMonthDate(date: Date | undefined): Date | undefined {
  if (!date) {
    return undefined;
  }

  const prevMonthDate = new Date(date);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  return prevMonthDate;
}

function ExtraHeader(props: {
  table: ReactTable<InstanceAuditLogResponse_AuditLogEntry>;
}) {
  const { t } = useTranslation('common');
  const dateFnsLocale = useDateFnsLocale();
  const timestampColumn = props.table.getColumn('timestamp')!;
  const range = timestampColumn.getFilterValue() as DateRange | undefined;

  return (
    <>
      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-[300px] justify-start text-left font-normal',
                !range && 'text-muted-foreground',
              )}
            >
              <CalendarIcon />
              {range?.from ? (
                range.to ? (
                  <>
                    {format(range.from, 'PP', {
                      locale: dateFnsLocale,
                    })}{' '}
                    -{' '}
                    {format(range.to, 'PP', {
                      locale: dateFnsLocale,
                    })}
                  </>
                ) : (
                  <>
                    {format(range.from, 'PP', {
                      locale: dateFnsLocale,
                    })}
                  </>
                )
              ) : (
                <span>{t('pickADate')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              locale={dateFnsLocale}
              mode="range"
              defaultMonth={getPreviousMonthDate(new Date())}
              selected={range}
              onSelect={timestampColumn.setFilterValue}
              numberOfMonths={2}
              fromDate={props.table
                .getCoreRowModel()
                .rows.map((row) => timestampToDate(row.original.timestamp!))
                .reduce((a, b) => (a < b ? a : b), new Date())}
              toDate={new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

function AuditLog() {
  const { t } = useTranslation('common');

  return (
    <InstancePageLayout
      extraCrumbs={[
        {
          id: 'controls',
          content: t('breadcrumbs.controls'),
        },
      ]}
      pageName={t('pageName.audit-log')}
    >
      <Content />
    </InstancePageLayout>
  );
}

function Content() {
  const { t } = useTranslation('common');
  const { instance } = Route.useParams();
  const { data: auditLog } = useSuspenseQuery(auditLogQueryOptions(instance));

  return (
    <div className="flex h-full w-full max-w-4xl grow flex-col gap-4">
      <DataTable
        filterPlaceholder={t('auditLog.filterPlaceholder')}
        columns={columns}
        data={auditLog.entry}
        extraHeader={ExtraHeader}
      />
    </div>
  );
}
