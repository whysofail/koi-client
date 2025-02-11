import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AuctionCardSkeleton = () => {
  return (
    <Card className="flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="space-y-2 pb-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-full" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default AuctionCardSkeleton;
