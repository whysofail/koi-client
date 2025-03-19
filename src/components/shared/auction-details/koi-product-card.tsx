"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
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
  AlertTriangle,
} from "lucide-react";
import { Koi } from "@/types/koiTypes";
import { calculateAge } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import KoiProductCardSkeleton from "@/components/skeletons/KoiProductCardSkeleton";

type KoiProductCardProps = {
  koi: Koi | undefined;
  isAdmin?: boolean;
  onKoiLoading?: boolean;
  onKoiError?: boolean;
};

const ErrorComponent: FC = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center text-red-500">
    <AlertTriangle className="mb-4 h-16 w-16" />
    <h3 className="text-lg font-medium">Error: Koi Data Not Found</h3>
    <p className="mt-2 text-sm">
      The requested koi information is unavailable.
    </p>
  </div>
);

const KoiProductCard: FC<KoiProductCardProps> = ({
  koi,
  isAdmin = false,
  onKoiError,
  onKoiLoading,
}) => {
  const [, setActiveTab] = useState("general");

  // Base URLs for images
  const trophyBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/trophy/`;
  const certificateBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/certificate/`;

  // Format price to currency
  const formatCurrency = (amount: number | null, currency: string) => {
    if (amount === null) return "-";

    if (currency === "IDR") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    }

    if (currency === "JPY") {
      return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        minimumFractionDigits: 0,
      }).format(amount);
    }

    return amount.toString();
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return dateString;
    }
  };
  if (onKoiLoading) return <KoiProductCardSkeleton />;
  if (onKoiError) return <ErrorComponent />;
  if (!koi) return <ErrorComponent />;

  return (
    <>
      <h4 className="text-3xl font-bold">Koi Information</h4>
      <Tabs
        defaultValue="general"
        className="w-full"
        onValueChange={setActiveTab}
      >
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
          <div className="grid ">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Size:</span>
                  </div>
                  <div>{koi.size} cm</div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Birthdate:</span>
                  </div>
                  <div>{formatDate(koi.birthdate)}</div>

                  <div className="flex items-center gap-2">
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Age:</span>
                  </div>
                  <div>{calculateAge(koi.birthdate ?? undefined)}</div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                  </div>
                  <div>{koi.location || "-"}</div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-lg font-semibold">Lineage</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Breeder:</div>
                  <div>{koi.breeder?.name ?? ""}</div>

                  <div className="text-muted-foreground">Bloodline:</div>
                  <div>{koi.bloodline?.name ?? ""}</div>

                  <div className="text-muted-foreground">Variety:</div>
                  <div>{koi.variety?.name ?? ""}</div>

                  <div className="text-muted-foreground">Gender:</div>
                  <div>{koi.gender}</div>
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
                      <div className="font-medium">
                        {formatCurrency(koi.price_sell_idr, "IDR")}
                      </div>

                      <div className="flex items-center gap-2">
                        <Yen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Sell Price (JPY):
                        </span>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(koi.price_sell_jpy, "JPY")}
                      </div>
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
                      <div>{koi.seller || "-"}</div>

                      <div className="text-muted-foreground">Handler:</div>
                      <div>{koi.handler || "-"}</div>

                      <div className="text-muted-foreground">
                        Purchase Date:
                      </div>
                      <div>{formatDate(koi.purchase_date)}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="certificate" className="mt-0">
          {koi.certificate ? (
            <div className="flex flex-col items-center py-2">
              <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-lg border">
                <Image
                  src={`${certificateBaseUrl}${koi.certificate}`}
                  alt={`${koi.code} Certificate`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Certificate className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Certificate Available</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This koi does not have any certificate information.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trophy" className="mt-0">
          {koi.trophy ? (
            <div className="flex flex-col items-center py-2">
              <div className="relative aspect-video  w-full max-w-2xl overflow-hidden rounded-lg border">
                <Image
                  src={`${trophyBaseUrl}${koi.trophy}`}
                  alt={`${koi.code} Trophy`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trophy className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Trophy Available</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This koi has not won any trophies yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default KoiProductCard;
