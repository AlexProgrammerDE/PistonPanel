import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { organization, user } from '~/db/auth-schema';

export const nodesTable = pgTable('nodes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  location: varchar({ length: 255 }),
  description: varchar({ length: 255 }),
});

export const auditLogActionEnum = pgEnum('org_audit_log_action', [
  'create-server',
  'update-server',
  'delete-server',
]);

export const orgAuditLogsTable = pgTable('org_audit_logs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  action: auditLogActionEnum('action').notNull(),
  orgId: text('org_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'no action' }),
  timestamp: timestamp({
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  data: jsonb('data').notNull().default({}),
});

export const orgServersTable = pgTable('org_servers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  nodeId: integer('node_id')
    .notNull()
    .references(() => nodesTable.id, { onDelete: 'cascade' }),
  orgId: text('org_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  serverId: text('server_id').notNull(),
  createdAt: timestamp({
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const orgDatabasesTable = pgTable('org_databases', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  nodeId: integer('node_id')
    .notNull()
    .references(() => nodesTable.id, { onDelete: 'cascade' }),
  orgId: text('org_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  createdAt: timestamp({
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
