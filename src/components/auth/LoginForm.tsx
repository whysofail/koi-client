"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import LoginFormViewModel from "./LoginForm.viewModel";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const LoginForm = () => {
  const { form, onSubmit, showPassword, togglePasswordVisibility, isLoading } =
    LoginFormViewModel();

  return (
    <div className="w-full p-8 md:w-1/2">
      <Card className="border-0 bg-zinc-100 shadow-none dark:bg-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Login
          </CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-zinc-900 dark:text-zinc-50">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@mail.com"
                        {...field}
                        className="border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-zinc-900 dark:text-zinc-50">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-400"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-zinc-900 dark:text-zinc-50">
                  <input
                    type="checkbox"
                    className="form-checkbox rounded border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700"
                  />
                  <span>Remember me</span>
                </label>
                <Button
                  variant="link"
                  className="px-0 font-semibold text-zinc-900 dark:text-zinc-50"
                >
                  Forgot password?
                </Button>
              </div>
              <Button
                className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
                type="submit"
                disabled={isLoading} // Disable button when isLoading
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  className="px-1 font-semibold text-zinc-900 dark:text-zinc-50"
                  asChild
                >
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
