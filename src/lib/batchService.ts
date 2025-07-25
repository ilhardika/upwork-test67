import { auth } from "./auth";
import type { InsertBatchSettings } from "@shared/schema";

const API_URL = import.meta.env.VITE_API_URL;

export const batchService = {
  async startBatch(settings: InsertBatchSettings) {
    const token = auth.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/start-master-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    const data = await response.json();

    // Handle different scenarios based on response
    if (response.status === 200) {
      // Check if it's success or error message
      if (data.task_id) {
        // Success case - has task_id
        return {
          status: response.status,
          success: true,
          data: data,
        };
      } else if (
        data.message?.includes("already running") ||
        data.message?.includes("pending")
      ) {
        // Error case - batch already running (still 200 status)
        throw new Error(data.message);
      } else {
        // Other 200 responses
        return {
          status: response.status,
          success: true,
          data: data,
        };
      }
    } else if (response.status === 500) {
      // Server error
      throw new Error(data.message || "Internal server error occurred");
    } else if (response.status === 422) {
      // Validation error - provide more detailed message
      const errorMessage =
        data.message || data.detail || "Validation error occurred";

      // If there are field-specific errors, include them
      if (data.errors || data.details) {
        const fieldErrors = data.errors || data.details;
        if (Array.isArray(fieldErrors)) {
          const errorDetails = fieldErrors
            .map((err) =>
              typeof err === "string"
                ? err
                : `${err.field || "Field"}: ${err.message || err.error || err}`
            )
            .join(", ");
          throw new Error(`${errorMessage}: ${errorDetails}`);
        } else if (typeof fieldErrors === "object") {
          const errorDetails = Object.entries(fieldErrors)
            .map(([field, error]) => `${field}: ${error}`)
            .join(", ");
          throw new Error(`${errorMessage}: ${errorDetails}`);
        }
      }

      throw new Error(errorMessage);
    } else {
      // Other error status codes
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }
  },

  async getAuthUrl() {
    const token = auth.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/get_auth_url`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.auth_url) {
      return data.auth_url;
    } else {
      throw new Error("Failed to get auth URL");
    }
  },

  async stopMasterBatch() {
    const token = auth.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/stop-master-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        status: response.status,
        success: true,
        data: data,
      };
    } else {
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }
  },
};
