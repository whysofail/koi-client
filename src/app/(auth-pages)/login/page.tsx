import React, { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => (
  <main className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900">
    <div className="container flex max-w-5xl overflow-hidden rounded-lg bg-zinc-100 shadow-lg duration-500 animate-in fade-in dark:bg-zinc-800">
      {/* Left Side - Branding */}
      <div className="hidden flex-col justify-between bg-zinc-900 p-12 text-zinc-50 dark:bg-zinc-950 md:flex md:w-1/2">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Welcome Back!</h1>
          <p className="text-lg text-zinc-400">
            Log in to access your account and start the auction right away!
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <p className="text-zinc-400">Koi Auction Dashboard</p>
          </div>
        </div>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  </main>
);

export default LoginPage;
