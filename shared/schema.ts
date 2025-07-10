import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const batchSettings = pgTable("batch_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  oldPatientsTarget: integer("old_patients_target").notNull().default(0),
  importSetupId: integer("import_setup_id").notNull(),
  hourlyBatchCount: integer("hourly_batch_count").notNull().default(60),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const batchSettingsSchema = z.object({
  oldPatientsTarget: z.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
  importSetupId: z.number().int().min(1, "Must be a positive integer greater than 0"),
  hourlyBatchCount: z.number().min(1, "Must be at least 1").max(100, "Must be at most 100"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type BatchSettings = typeof batchSettings.$inferSelect;
export type InsertBatchSettings = z.infer<typeof batchSettingsSchema>;
