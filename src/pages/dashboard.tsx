import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader2, AlertCircle, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { batchSettingsSchema, type InsertBatchSettings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { auth } from "@/lib/auth";
import { batchService } from "@/lib/batchService";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  // Fetch current user
  const { data: user } = useQuery<{ id: number; email: string }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch current batch settings
  const { data: currentSettings } = useQuery<{
    new_call_schedule_percentage?: number;
    import_setup_id?: number;
    hourly_batch_count?: number;
  }>({
    queryKey: ["/api/batch-settings"],
    retry: false,
  });

  const form = useForm<InsertBatchSettings>({
    resolver: zodResolver(batchSettingsSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      new_call_schedule_percentage: 0,
      import_setup_id: undefined,
      hourly_batch_count: 60,
    },
  });

  // Update form when settings are loaded
  useEffect(() => {
    if (currentSettings) {
      form.reset({
        new_call_schedule_percentage:
          currentSettings.new_call_schedule_percentage || 0,
        import_setup_id: currentSettings.import_setup_id,
        hourly_batch_count: currentSettings.hourly_batch_count || 60,
      });
    }
  }, [currentSettings, form]);

  const startBatchMutation = useMutation({
    mutationFn: async (data: InsertBatchSettings) => {
      const response = await apiRequest("POST", "/api/batch/start", data);
      return response.json();
    },
    onSuccess: async (responseData) => {
      setErrorMessage("");
      setErrorDetails(null);
      setSuccessMessage("Batch started successfully.");

      // Store the API response for display
      setApiResponse(responseData.data || responseData);

      setTimeout(() => setSuccessMessage(""), 10000);
    },
    onError: (error: Error, variables) => {
      setSuccessMessage("");
      setApiResponse(null);
      setErrorMessage(error.message);

      // Try to extract error details from the error
      try {
        // If error has additional details, store them
        setErrorDetails({
          message: error.message,
          timestamp: new Date().toISOString(),
          request_data: variables,
        });
      } catch (e) {
        setErrorDetails(null);
      }
    },
  });

  const handleLogout = () => {
    auth.removeToken();
    setLocation("/login");
  };

  const handleConnectCalendar = async () => {
    try {
      const authUrlResponse = await batchService.getAuthUrl();
      window.open(authUrlResponse, "_blank");
    } catch (error) {
      console.error("Failed to get auth URL:", error);
      setErrorMessage("Failed to get calendar auth URL. Please try again.");
    }
  };

  const onSubmit = (data: InsertBatchSettings) => {
    setSuccessMessage("");
    setErrorMessage("");
    setApiResponse(null);
    setErrorDetails(null);
    startBatchMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleConnectCalendar}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Connect Calendar
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Dashboard settings
            </h2>
            <p className="text-gray-600">
              Configure your batch processing settings
            </p>
          </div>

          {/* Settings Form */}
          <Card>
            <CardContent className="p-6 sm:p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* New Call Schedule Percentage */}
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="new_call_schedule_percentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>% of new records to target</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="0"
                                  className={`px-3 py-3 pr-8 ${
                                    form.formState.errors
                                      .new_call_schedule_percentage
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                      : ""
                                  }`}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "") {
                                      field.onChange("");
                                    } else {
                                      field.onChange(Number(value));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  %
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              Enter a value between 0 and 100
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Import Setup ID */}
                    <div>
                      <FormField
                        control={form.control}
                        name="import_setup_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Import Setup Id</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                placeholder="Enter setup ID"
                                className={`px-3 py-3 ${
                                  form.formState.errors.import_setup_id
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : ""
                                }`}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    field.onChange("");
                                  } else {
                                    field.onChange(Number(value));
                                  }
                                }}
                              />
                            </FormControl>
                            <p className="text-xs text-gray-500">
                              Must be a positive integer greater than 0
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Hourly Batch Count */}
                    <div>
                      <FormField
                        control={form.control}
                        name="hourly_batch_count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly batch count</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                max="100"
                                placeholder="60"
                                className={`px-3 py-3 ${
                                  form.formState.errors.hourly_batch_count
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : ""
                                }`}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    field.onChange("");
                                  } else {
                                    field.onChange(Number(value));
                                  }
                                }}
                              />
                            </FormControl>
                            <p className="text-xs text-gray-500">
                              Enter a value between 1 and 100
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Status Messages */}
                  {successMessage && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        {successMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* API Response Display */}
                  {apiResponse && (
                    <Alert className="border-gray-200 bg-gray-50">
                      <Info className="h-4 w-4 text-gray-600" />
                      <AlertDescription className="text-gray-700">
                        <div className="space-y-2">
                          <p className="font-medium">API Response:</p>
                          <div className="bg-gray-100 rounded-md p-3 overflow-x-auto">
                            <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                              {JSON.stringify(apiResponse, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  {/* Error Details Display */}
                  {errorDetails && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        <div className="space-y-2">
                          <p className="font-medium">Error Details:</p>
                          <div className="bg-red-100 rounded-md p-3 overflow-x-auto">
                            <pre className="text-xs text-red-800 whitespace-pre-wrap">
                              {JSON.stringify(errorDetails, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3"
                      disabled={startBatchMutation.isPending}
                    >
                      {startBatchMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Starting batch...
                        </>
                      ) : (
                        "Start batch"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">
                    Batch Processing Information
                  </p>
                  <p>
                    Batches will be processed according to your configured
                    settings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
