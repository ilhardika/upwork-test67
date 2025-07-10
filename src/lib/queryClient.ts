import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { mockAuthService, mockBatchService } from "./mockApi";

// Mock API request function that routes to appropriate mock services
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<{ json: () => Promise<any> }> {
  // Route to appropriate mock service based on URL
  if (url === "/api/auth/login" && method === "POST") {
    const result = await mockAuthService.login(data as any);
    return { json: async () => result };
  }

  if (url === "/api/auth/me" && method === "GET") {
    const result = await mockAuthService.getCurrentUser();
    return { json: async () => result };
  }

  if (url === "/api/batch-settings" && method === "GET") {
    const result = await mockBatchService.getBatchSettings();
    return { json: async () => result };
  }

  if (url === "/api/batch/start" && method === "POST") {
    const result = await mockBatchService.startBatch(data as any);
    return { json: async () => result };
  }

  throw new Error(`Mock API: Unhandled request ${method} ${url}`);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;

    try {
      const response = await apiRequest("GET", url);
      return await response.json();
    } catch (error) {
      if (
        unauthorizedBehavior === "returnNull" &&
        error instanceof Error &&
        error.message.includes("No token found")
      ) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
