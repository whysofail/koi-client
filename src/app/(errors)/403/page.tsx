import Link from "next/link";
import { ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";

const Forbidden = () => {
  return (
    <main className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-muted rounded-full p-4">
          <ShieldX className="text-muted-foreground h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Access Forbidden
        </h1>
        <p className="text-muted-foreground text-sm">
          You don&apos;t have permission to access this resource.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </main>
  );
};

export default Forbidden;
