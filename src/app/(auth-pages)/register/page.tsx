import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage: React.FC = () => (
  <main className="flex min-h-screen w-full items-center justify-center bg-gray-50">
    <div className="container flex max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg duration-500 animate-in fade-in">
      {/* Left Side - Branding */}
      <div className="hidden flex-col justify-between bg-black p-12 text-white md:flex md:w-1/2">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Create an Account</h1>
          <p className="text-primary-foreground/80 text-lg">
            Create an account to start bidding on your favorite koi fish!
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <p>Koi Auction System</p>
          </div>
        </div>
      </div>
      <RegisterForm />
    </div>
  </main>
);

export default RegisterPage;
