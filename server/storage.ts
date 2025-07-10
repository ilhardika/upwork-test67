import { users, batchSettings, type User, type InsertUser, type BatchSettings, type InsertBatchSettings } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getBatchSettings(userId: number): Promise<BatchSettings | undefined>;
  upsertBatchSettings(userId: number, settings: InsertBatchSettings): Promise<BatchSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private batchSettings: Map<number, BatchSettings>;
  private currentUserId: number;
  private currentBatchSettingsId: number;

  constructor() {
    this.users = new Map();
    this.batchSettings = new Map();
    this.currentUserId = 1;
    this.currentBatchSettingsId = 1;

    // Create demo user
    this.users.set(1, {
      id: 1,
      email: "demo@example.com",
      password: "password123", // In real app, this would be hashed
      createdAt: new Date(),
    });
    this.currentUserId = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getBatchSettings(userId: number): Promise<BatchSettings | undefined> {
    return Array.from(this.batchSettings.values()).find(
      (settings) => settings.userId === userId,
    );
  }

  async upsertBatchSettings(userId: number, settings: InsertBatchSettings): Promise<BatchSettings> {
    const existing = await this.getBatchSettings(userId);
    
    if (existing) {
      const updated: BatchSettings = {
        ...existing,
        ...settings,
        updatedAt: new Date(),
      };
      this.batchSettings.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentBatchSettingsId++;
      const newSettings: BatchSettings = {
        id,
        userId,
        ...settings,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.batchSettings.set(id, newSettings);
      return newSettings;
    }
  }
}

export const storage = new MemStorage();
