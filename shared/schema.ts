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
  oldPatientsTarget: z.coerce.number({
    required_error: "Old patients target percentage is required",
    invalid_type_error: "Must be a number"
  }).min(0, "Minimum value is 0").max(100, "Maximum value is 100"),
  importSetupId: z.coerce.number({
    required_error: "Import Setup ID is required",
    invalid_type_error: "Must be a number"
  }).int("Must be an integer").min(1, "Must be a positive integer greater than 0"),
  hourlyBatchCount: z.coerce.number({
    required_error: "Hourly batch count is required", 
    invalid_type_error: "Must be a number"
  }).min(1, "Minimum value is 1").max(100, "Maximum value is 100"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type BatchSettings = typeof batchSettings.$inferSelect;
export type InsertBatchSettings = z.infer<typeof batchSettingsSchema>;
