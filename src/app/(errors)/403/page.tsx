import Link from "next/link";
import { ShieldX, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

const ForbiddenOrNotFound = () => {
  return (
    <main className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-muted flex items-center justify-center rounded-full p-4">
          <ShieldX className="text-muted-foreground h-8 w-8" />|
          <FileWarning className="text-muted-foreground h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Access Denied or Page Not Found
        </h1>
        <p className="text-muted-foreground text-sm">
          You either don&apos;t have permission to access this page, or it
          doesn&apos;t exist.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Return Home</Link>
      </Button>
    </main>
  );
};

export default ForbiddenOrNotFound;
