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

const LoginForm = () => {
  const { form, onSubmit } = LoginFormViewModel();

  return (
    <div className="w-full p-8 md:w-1/2">
      <Card className="border-0 shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@mail.com"
                        {...field}
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="••••••••"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    className="form-checkbox rounded border-gray-300"
                  />
                  <span>Remember me</span>
                </label>
                <Button variant="link" className="px-0 font-semibold">
                  Forgot password?
                </Button>
              </div>
              <Button className="w-full" type="submit">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Button variant="link" className="px-1 font-semibold">
                  Sign up
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
