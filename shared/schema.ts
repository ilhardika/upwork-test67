import { z } from "zod";

// User types
export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
}

// Batch settings types
export interface BatchSettings {
  id: number;
  userId: number;
  oldPatientsTarget: number;
  importSetupId: number;
  hourlyBatchCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Validation schemas
export const insertUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const batchSettingsSchema = z.object({
  new_call_schedule_percentage: z.coerce
    .number({
      required_error: "New call schedule percentage is required",
      invalid_type_error: "Must be a number",
    })
    .min(0, "Minimum value is 0")
    .max(100, "Maximum value is 100"),
  imort_setup_id: z.coerce
    .number({
      required_error: "Import Setup ID is required",
      invalid_type_error: "Must be a number",
    })
    .int("Must be an integer")
    .min(1, "Must be a positive integer greater than 0"),
  hourly_batch_count: z.coerce
    .number({
      required_error: "Hourly batch count is required",
      invalid_type_error: "Must be a number",
    })
    .min(1, "Minimum value is 1")
    .max(100, "Maximum value is 100"),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type InsertBatchSettings = z.infer<typeof batchSettingsSchema>;
