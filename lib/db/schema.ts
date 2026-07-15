import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const pastes = pgTable("sxpaste_pastes", {
  slug: text("slug").primaryKey(),
  content: text("content").notNull(),
  editToken: text("edit_token").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Paste = typeof pastes.$inferSelect;
export type NewPaste = typeof pastes.$inferInsert;

// Fixed-window rate limiter, keyed by "<scope>:<identifier>" (e.g. "create:1.2.3.4").
export const rateLimits = pgTable("sxpaste_rate_limits", {
  key: text("key").primaryKey(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
  count: integer("count").notNull().default(1),
});
