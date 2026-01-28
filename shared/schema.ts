import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const slides = pgTable("slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").notNull(),
});

export const insertSlideSchema = createInsertSchema(slides).omit({ id: true });

export type Slide = typeof slides.$inferSelect;
export type InsertSlide = z.infer<typeof insertSlideSchema>;
