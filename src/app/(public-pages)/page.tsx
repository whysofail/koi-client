"use client";
import React, { FC, useMemo } from "react";
import Image from "next/image";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const LandingPage: FC = () => {
  // Fetch auctions
  const { data: upcomingAuction } = useGetAllAuctions({
    limit: 1,
    orderBy: AuctionOrderBy.START_DATETIME,
    order: "ASC",
    status: AuctionStatus.PUBLISHED,
  });

  const { data: currentAuction } = useGetAllAuctions({
    limit: 1,
    orderBy: AuctionOrderBy.START_DATETIME,
    order: "ASC",
    status: AuctionStatus.STARTED,
  });

  const { data: pastAuction } = useGetAllAuctions({
    limit: 1,
    orderBy: AuctionOrderBy.END_DATETIME,
    order: "DESC",
    status: AuctionStatus.COMPLETED,
  });

  // Prepare auction data for the grid section (only upcoming and past)
  const auctionData = useMemo(
    () => [
      {
        title: "Upcoming Events",
        data: upcomingAuction,
        status: AuctionStatus.PUBLISHED,
      },
      {
        title: "Past Events",
        data: pastAuction,
        status: AuctionStatus.COMPLETED,
      },
    ],
    [upcomingAuction, pastAuction],
  );

  // Extract koi IDs safely
  const upcomingKoiId = upcomingAuction?.data?.[0]?.item || "";
  const currentKoiId = currentAuction?.data?.[0]?.item || "";
  const pastKoiId = pastAuction?.data?.[0]?.item || "";

  // Call hooks individually at the top level
  const { data: upcomingKoi } = useGetKoiByID(upcomingKoiId, {
    enabled: !!upcomingKoiId,
  });

  const { data: currentKoi } = useGetKoiByID(currentKoiId, {
    enabled: !!currentKoiId,
  });

  const { data: pastKoi } = useGetKoiByID(pastKoiId, {
    enabled: !!pastKoiId,
  });

  // Map koi data to auction data for the grid
  const koiData = [upcomingKoi, pastKoi];

  const getImageUrl = (photo: string | undefined) => {
    const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
    const imageArray = photo?.split("|") || [];
    return imageArray[0]
      ? `${imageBaseUrl}${imageArray[0]}`
      : "/placeholder.svg";
  };

  // Format banner dates
  const formatBannerDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yyyy.MM.dd HH:mm");
    } catch (error) {
      console.error(error);
      return dateString;
    }
  };

  return (
    <main className="flex-grow dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="relative overflow-hidden rounded-3xl bg-black">
          <div className="relative h-[200px] sm:h-[300px] md:h-[400px]">
            {/* Use current koi image if available, otherwise fallback to generic image */}
            <Image
              src={
                currentKoi?.photo ? getImageUrl(currentKoi.photo) : "/ikan.png"
              }
              alt={currentKoi?.code || "Koi fish"}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

            {/* Content */}
            <div className="relative z-10 max-w-2xl p-4 text-white sm:p-8 md:p-12">
              <h1 className="mb-2 text-3xl font-bold sm:text-4xl md:mb-4 md:text-5xl">
                Current Event
              </h1>
              {currentAuction?.data?.[0] ? (
                <>
                  <p className="mb-2 text-xs text-yellow-200 sm:text-sm md:mb-4">
                    Period of the event |{" "}
                    {formatBannerDate(currentAuction.data[0].start_datetime)} -{" "}
                    {formatBannerDate(currentAuction.data[0].end_datetime)}
                  </p>
                  <p className="hidden text-xs text-gray-200 sm:block sm:text-sm md:text-base">
                    {currentAuction.data[0].description ||
                      "No description available."}
                  </p>
                </>
              ) : (
                <p className="mb-2 text-xs text-yellow-200 sm:text-sm md:mb-4">
                  No current events at this time
                </p>
              )}
            </div>

            {/* Navigation */}
            <button className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-1 sm:left-4 sm:p-2">
              <ChevronLeft className="h-4 w-4 text-white sm:h-6 sm:w-6" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-1 sm:right-4 sm:p-2">
              <ChevronRight className="h-4 w-4 text-white sm:h-6 sm:w-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2 sm:bottom-6">
              <div className="h-2 w-2 rounded-full bg-white" />
              <div className="h-2 w-2 rounded-full bg-white/50" />
              <div className="h-2 w-2 rounded-full bg-white/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Events Section (Now only showing upcoming and past) */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {auctionData.map(({ title, data, status }, index) => {
            if (!data?.data?.length) return null;

            const koi = koiData[index]; // Get koi data for this auction

            return (
              <div key={status} className="relative mt-6">
                <div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 transform rounded-full bg-[#E8D5B0] px-8 py-2 text-lg font-bold dark:bg-[#6a5c41] dark:text-gray-100 sm:text-xl">
                  {title}
                </div>
                <div className="flex flex-col rounded-xl bg-red-800 p-4 dark:bg-red-900 sm:flex-row sm:p-6">
                  <div className="relative mb-4 flex w-full justify-center sm:mb-0 sm:block sm:w-1/3">
                    <div className="relative h-[150px] w-[150px] overflow-hidden rounded-lg bg-blue-500">
                      <Image
                        src={getImageUrl(koi?.photo)}
                        alt={koi?.code || "Koi Fish"}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="w-full text-white sm:w-2/3 sm:pl-6">
                    <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                      {data.data[0]?.title || "Auction Event"}
                    </h3>
                    <p className="mb-2 text-xs text-yellow-200 sm:text-sm">
                      Period of the event
                      <br />
                      {format(
                        new Date(data.data[0]?.start_datetime),
                        "dd MMMM yyyy HH:mm O",
                      )}{" "}
                      -{" "}
                      {format(
                        new Date(data.data[0]?.end_datetime),
                        "dd MMMM yyyy HH:mm O",
                      )}
                    </p>
                    <p className="text-xs sm:text-sm">
                      {data.data[0]?.description || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-[#E8D5B0] p-4 dark:bg-[#6a5c41] sm:p-8">
          <h2 className="mb-6 text-center text-2xl font-bold dark:text-gray-100 sm:mb-8 sm:text-3xl">
            News
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex flex-col rounded-lg bg-white p-4 dark:bg-gray-800 sm:flex-row"
              >
                <div className="mb-2 w-full font-bold text-red-800 dark:text-red-300 sm:mb-0 sm:w-32">
                  2024 12 31
                </div>
                <div className="flex-1 dark:text-gray-200">
                  <h3 className="mb-2 font-bold">
                    {item === 1 ? "Auction winner" : "Lorem Ipsum"}
                  </h3>
                  <p className="text-xs sm:text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                    commodo viverra maecenas accumsan lacus vel facilisis.
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center space-x-2 dark:text-gray-200">
            <Link href="#" className="px-2">
              1
            </Link>
            <Link href="#" className="px-2">
              2
            </Link>
            <Link href="#" className="px-2">
              3
            </Link>
            <Link href="#" className="px-2">
              4
            </Link>
            <Link href="#" className="px-2">
              »
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
            <Image
              src="/placeholder.svg?height=120&width=120"
              alt="FS KOI Logo"
              width={100}
              height={100}
              className="object-contain"
            />
            <div className="text-center dark:text-gray-200 sm:text-left">
              <div className="mb-2">
                <span className="font-bold">Location</span> | Lorem Ipsum
              </div>
              <div className="mb-2">
                <span className="font-bold">Tel</span> | 021 123456
              </div>
              <div className="mb-2">
                <span className="font-bold">Mail</span> | LoremIpsum@mail.com
              </div>
              <div className="mt-4 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">
                  FS KOI
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Image
              src="/placeholder.svg?height=300&width=600"
              alt="Location Map"
              width={600}
              height={300}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
