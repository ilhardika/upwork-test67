import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth } from "./auth";
import { batchService } from "./batchService";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  // Handle special batch start endpoint
  if (url === "/api/batch/start" && method === "POST") {
    const result = await batchService.startBatch(data as any);
    return {
      ok: true,
      json: async () => result.data,
    } as Response;
  }

  // Handle stop master batch endpoint
  if (url === "/api/stop-master-batch" && method === "POST") {
    const result = await batchService.stopMasterBatch();
    return {
      ok: true,
      json: async () => result.data,
    } as Response;
  }

  // Handle login endpoint
  if (url === "/api/auth/login" && method === "POST") {
    const result = await auth.login(
      (data as any).email,
      (data as any).password
    );
    auth.setUserEmail((data as any).email);
    return {
      ok: true,
      json: async () => result,
    } as Response;
  }

  // Handle get current user
  if (url === "/api/auth/me" && method === "GET") {
    const result = await auth.getCurrentUser();
    return {
      ok: true,
      json: async () => result,
    } as Response;
  }

  // Handle batch settings - for now return empty since API doesn't have this endpoint
  if (url === "/api/batch-settings" && method === "GET") {
    return {
      ok: true,
      json: async () => ({}),
    } as Response;
  }

  throw new Error(`Unhandled request ${method} ${url}`);
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
