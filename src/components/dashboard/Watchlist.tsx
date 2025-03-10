import React, { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";

const Watchlist: FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Koi #{i + 1}</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-5 bg-slate-400" />
            <div className="mt-2">
              <div className="text-lg font-bold">Rp. 400.000</div>
              <p className="text-sm text-muted-foreground">Ends in 2d 5h</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Watchlist;
