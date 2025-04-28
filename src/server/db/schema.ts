import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const nodesTable = pgTable('nodes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  location: varchar({ length: 255 }),
  description: varchar({ length: 255 }),
});
