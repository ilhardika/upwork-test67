import { mockUsers, mockBatchSettings, defaultBatchSettings } from './mockData';
import { loginSchema, batchSettingsSchema, type LoginRequest, type InsertBatchSettings } from '@shared/schema';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication service
export const mockAuthService = {
  async login(credentials: LoginRequest) {
    await delay(1500); // Simulate network delay
    
    const { email, password } = loginSchema.parse(credentials);
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate mock JWT token (just base64 encoded user info)
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      }
    };
  },

  async getCurrentUser() {
    await delay(500);
    
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const userData = JSON.parse(atob(token));
      const user = mockUsers.find(u => u.id === userData.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

// Mock batch service
export const mockBatchService = {
  async getBatchSettings() {
    await delay(500);
    
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const userData = JSON.parse(atob(token));
      const settings = mockBatchSettings[userData.userId as keyof typeof mockBatchSettings];
      
      return settings || defaultBatchSettings;
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  async startBatch(settings: InsertBatchSettings) {
    await delay(2000); // Simulate processing time
    
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const validatedSettings = batchSettingsSchema.parse(settings);
      
      // Simulate saving settings (in real app, this would persist)
      const userData = JSON.parse(atob(token));
      console.log('Saving batch settings for user:', userData.userId, validatedSettings);
      
      // Simulate random success/failure (70% success rate)
      if (Math.random() > 0.3) {
        return { status: "success", message: "Batch started successfully" };
      } else {
        throw new Error("Failed to start batch: Server temporarily unavailable");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Invalid batch settings');
    }
  }
};
