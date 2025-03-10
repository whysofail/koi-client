import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const StatsCardsError = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-center pb-2">
          <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
          <h3 className="font-medium text-destructive">
            Failed to load statistics
          </h3>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          Please try refreshing the page
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCardsError;
