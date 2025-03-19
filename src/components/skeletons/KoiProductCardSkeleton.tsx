"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Trophy,
  BadgeIcon as Certificate,
  Info,
  MapPin,
  Ruler,
  JapaneseYenIcon as Yen,
  DollarSign,
} from "lucide-react";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const KoiProductCardSkeleton = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  return (
    <>
      <h4>
        <div className="h-6 w-32 animate-pulse rounded-md bg-muted"></div>
      </h4>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">General Information</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger value="certificate" className="flex items-center gap-1">
            <Certificate className="h-4 w-4" />
            <span className="hidden sm:inline">Certification</span>
            <span className="sm:hidden">Cert</span>
          </TabsTrigger>
          <TabsTrigger value="trophy" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Trophy</span>
            <span className="sm:hidden">Trophy</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-0 space-y-4">
          <div className="grid">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Size:</span>
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded-md bg-muted"></div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Birthdate:</span>
                  </div>
                  <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>

                  <div className="flex items-center gap-2">
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Age:</span>
                  </div>
                  <div className="h-4 w-12 animate-pulse rounded-md bg-muted"></div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                  </div>
                  <div className="h-4 w-20 animate-pulse rounded-md bg-muted"></div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-lg font-semibold">Lineage</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Breeder:</div>
                  <div className="h-4 w-28 animate-pulse rounded-md bg-muted"></div>

                  <div className="text-muted-foreground">Bloodline:</div>
                  <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>

                  <div className="text-muted-foreground">Variety:</div>
                  <div className="h-4 w-20 animate-pulse rounded-md bg-muted"></div>

                  <div className="text-muted-foreground">Gender:</div>
                  <div className="h-4 w-16 animate-pulse rounded-md bg-muted"></div>
                </div>
              </div>

              {isAdmin && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Pricing</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Sell Price (IDR):
                        </span>
                      </div>
                      <div className="h-4 w-32 animate-pulse rounded-md bg-muted"></div>

                      <div className="flex items-center gap-2">
                        <Yen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Sell Price (JPY):
                        </span>
                      </div>
                      <div className="h-4 w-32 animate-pulse rounded-md bg-muted"></div>
                    </div>
                  </div>
                </>
              )}

              {isAdmin && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Acquisition</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Seller:</div>
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>

                      <div className="text-muted-foreground">Handler:</div>
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>

                      <div className="text-muted-foreground">
                        Purchase Date:
                      </div>
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="certificate" className="mt-0">
          <div className="flex flex-col items-center py-2">
            <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-lg border">
              <div className="h-full w-full animate-pulse bg-muted"></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trophy" className="mt-0">
          <div className="flex flex-col items-center py-2">
            <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-lg border">
              <div className="h-full w-full animate-pulse bg-muted"></div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default KoiProductCardSkeleton;
