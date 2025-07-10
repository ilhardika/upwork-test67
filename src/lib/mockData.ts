// Mock user data
export const mockUsers = [
  {
    id: 1,
    email: "demo@example.com",
    password: "password123",
  },
  {
    id: 2,
    email: "admin@example.com",
    password: "admin123",
  },
  {
    id: 3,
    email: "user@example.com",
    password: "user123",
  },
];

// Mock batch settings
export const mockBatchSettings = {
  1: {
    id: 1,
    userId: 1,
    oldPatientsTarget: 0,
    importSetupId: 1,
    hourlyBatchCount: 60,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  2: {
    id: 2,
    userId: 2,
    oldPatientsTarget: 30,
    importSetupId: 102,
    hourlyBatchCount: 60,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-16"),
  },
};

// Default batch settings for new users
export const defaultBatchSettings = {
  oldPatientsTarget: 0,
  importSetupId: 1,
  hourlyBatchCount: 60,
};
