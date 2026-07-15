import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const pastes = pgTable("sxpaste_pastes", {
  slug: text("slug").primaryKey(),
  content: text("content").notNull(),
  editToken: text("edit_token").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Paste = typeof pastes.$inferSelect;
export type NewPaste = typeof pastes.$inferInsert;
