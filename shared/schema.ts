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
    required_error: "Persentase target pasien lama diperlukan",
    invalid_type_error: "Harus berupa angka"
  }).min(0, "Nilai minimal adalah 0").max(100, "Nilai maksimal adalah 100"),
  importSetupId: z.coerce.number({
    required_error: "Import Setup ID diperlukan",
    invalid_type_error: "Harus berupa angka"
  }).int("Harus berupa bilangan bulat").min(1, "Harus berupa bilangan bulat positif lebih dari 0"),
  hourlyBatchCount: z.coerce.number({
    required_error: "Jumlah batch per jam diperlukan", 
    invalid_type_error: "Harus berupa angka"
  }).min(1, "Nilai minimal adalah 1").max(100, "Nilai maksimal adalah 100"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type BatchSettings = typeof batchSettings.$inferSelect;
export type InsertBatchSettings = z.infer<typeof batchSettingsSchema>;
