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

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch current batch settings
  const { data: currentSettings } = useQuery({
    queryKey: ["/api/batch-settings"],
    retry: false,
  });

  const form = useForm<InsertBatchSettings>({
    resolver: zodResolver(batchSettingsSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      oldPatientsTarget: 0,
      importSetupId: 1,
      hourlyBatchCount: 60,
    },
  });

  // Update form when settings are loaded
  useEffect(() => {
    if (currentSettings) {
      form.reset({
        oldPatientsTarget: currentSettings.oldPatientsTarget || 0,
        importSetupId: currentSettings.importSetupId || 1,
        hourlyBatchCount: currentSettings.hourlyBatchCount || 60,
      });
    }
  }, [currentSettings, form]);

  const startBatchMutation = useMutation({
    mutationFn: async (data: InsertBatchSettings) => {
      const response = await apiRequest("POST", "/api/batch/start", data);
      return response.json();
    },
    onSuccess: () => {
      setErrorMessage("");
      setSuccessMessage("Batch started successfully");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (error: Error) => {
      setSuccessMessage("");
      setErrorMessage(error.message);
    },
  });

  const handleLogout = () => {
    auth.removeToken();
    setLocation("/login");
  };

  const onSubmit = (data: InsertBatchSettings) => {
    setSuccessMessage("");
    setErrorMessage("");
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
                    {/* Old Patients Target */}
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="oldPatientsTarget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>% of old patients to target</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="0"
                                  className={`px-3 py-3 pr-8 ${form.formState.errors.oldPatientsTarget ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
                        name="importSetupId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Import Setup Id</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                placeholder="Enter setup ID"
                                className={`px-3 py-3 ${form.formState.errors.importSetupId ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
                        name="hourlyBatchCount"
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
                                className={`px-3 py-3 ${form.formState.errors.hourlyBatchCount ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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

                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errorMessage}</AlertDescription>
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
