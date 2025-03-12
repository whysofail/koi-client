import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WishlistItemGridSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full" />
        <div className="absolute right-2 top-2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="absolute bottom-2 right-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <CardHeader className="p-4 pb-0">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-5/6" />
        <div className="mb-2 flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div>
          <Skeleton className="mb-1 h-4 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}
