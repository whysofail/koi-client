"use client";
import React, { FC, useMemo } from "react";
import Image from "next/image";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { format } from "date-fns";
import Link from "next/link";
import AuctionBanner from "@/components/home/auction-banner";
import NewsSection from "@/components/home/news/news-section";

const LandingPage: FC = () => {
  // Fetch auctions
  const { data: upcomingAuction } = useGetAllAuctions({
    limit: 1,
    orderBy: AuctionOrderBy.START_DATETIME,
    order: "ASC",
    status: AuctionStatus.PUBLISHED,
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
  const pastKoiId = pastAuction?.data?.[0]?.item || "";

  // Call hooks individually at the top level
  const { data: upcomingKoi } = useGetKoiByID(upcomingKoiId, {
    enabled: !!upcomingKoiId,
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

  return (
    <main className="mx-auto flex-grow dark:bg-gray-900">
      <AuctionBanner />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {auctionData.map(({ title, data, status }, index) => {
            const koi = koiData[index]; // Get koi data for this auction
            const hasAuctions = data?.data && data.data.length > 0;

            return (
              <div key={status} className="relative mt-6">
                <div
                  className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded-full bg-[#E8D5B0] px-8 py-2 text-lg font-bold
 dark:bg-[#6a5c41] dark:text-gray-100 sm:text-xl"
                >
                  {title}
                </div>
                <div className="flex flex-col rounded-xl bg-red-800 p-4 dark:bg-red-900 sm:flex-row sm:p-6">
                  {hasAuctions ? (
                    <>
                      <Link href={`/auctions/${data?.data?.[0]?.auction_id}`}>
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
                      </Link>
                      <Link href={`/auctions/${data?.data?.[0]?.auction_id}`}>
                        <div className="w-full text-white sm:w-2/3 sm:pl-6">
                          <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                            {data?.data?.[0]?.title || "Auction Event"}
                          </h3>
                          <p className="mb-2 text-xs text-yellow-200 sm:text-sm">
                            Period of the event
                            <br />
                            {data?.data?.[0]?.start_datetime
                              ? format(
                                  new Date(data.data[0].start_datetime),
                                  "dd MMMM yyyy HH:mm O",
                                )
                              : "Unknown Start Date"}{" "}
                            -{" "}
                            {data?.data?.[0]?.end_datetime
                              ? format(
                                  new Date(data.data[0].end_datetime),
                                  "dd MMMM yyyy HH:mm O",
                                )
                              : "Unknown End Date"}
                          </p>
                          <p className="text-xs sm:text-sm">
                            {data?.data?.[0]?.description ||
                              "No description available."}
                          </p>
                        </div>
                      </Link>
                    </>
                  ) : (
                    <div className="w-full py-6 text-center text-white">
                      <p className="text-lg font-bold">No auctions available</p>
                      <p className="text-sm text-yellow-200">
                        Check back later for upcoming events.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewsSection />
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
