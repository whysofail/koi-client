"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const SessionExpiredPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [returnTo, setReturnTo] = useState<string>("/dashboard");
  useEffect(() => {
    signOut({ redirect: false });
    const returnToParam = searchParams.get("returnTo");
    if (returnToParam) {
      setReturnTo(returnToParam);
    }
  }, [searchParams]);
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Session Expired</CardTitle>
          <CardDescription>
            Your session has expired. Please log in again to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/login?callbackUrl=${encodeURIComponent(returnTo)}`}>
            <Button className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Log In Again
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionExpiredPage;
