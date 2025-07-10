import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, batchSettingsSchema } from "@shared/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Add delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        token,
        user: {
          id: user.id,
          email: user.email,
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get batch settings
  app.get("/api/batch-settings", authenticateToken, async (req: any, res) => {
    try {
      const settings = await storage.getBatchSettings(req.user.userId);
      res.json(settings || {
        oldPatientsTarget: 0,
        importSetupId: null,
        hourlyBatchCount: 60,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch batch settings" });
    }
  });

  // Start batch endpoint
  app.post("/api/batch/start", authenticateToken, async (req, res) => {
    try {
      // Add delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const settings = batchSettingsSchema.parse(req.body);
      
      // Save settings
      await storage.upsertBatchSettings(req.user.userId, settings);

      // Simulate random success/failure (70% success rate)
      if (Math.random() > 0.3) {
        res.json({ status: "success", message: "Batch started successfully" });
      } else {
        res.status(500).json({ message: "Failed to start batch: Server temporarily unavailable" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid batch settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
