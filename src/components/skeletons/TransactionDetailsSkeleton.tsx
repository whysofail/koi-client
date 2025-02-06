import { Card, CardContent, CardFooter } from "@/components/ui/card";

const TransactionDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 h-8 w-64 rounded bg-gray-200"></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-4 w-32 rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col justify-start gap-2 p-4 sm:flex-row">
            <div className="h-10 w-24 rounded bg-gray-200"></div>
            <div className="h-10 w-24 rounded bg-gray-200"></div>
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
            <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
            <div className="relative aspect-square w-full rounded bg-gray-200"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetailsSkeleton;
