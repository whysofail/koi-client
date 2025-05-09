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
import ContactInfo from "@/components/home/contact-info";

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
 sm:text-xl dark:bg-[#6a5c41] dark:text-gray-100"
                >
                  {title}
                </div>
                <div className="flex flex-col rounded-xl bg-red-800 p-4 sm:flex-row sm:p-6 dark:bg-red-900">
                  {hasAuctions ? (
                    <>
                      <Link href={`/auctions/${data?.data?.[0]?.auction_id}`}>
                        <div className="relative mb-4 mt-6 flex w-full justify-center sm:mb-0 sm:block sm:w-1/3">
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
                        <div className="w-full text-white  sm:pl-6">
                          <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                            {data?.data?.[0]?.title || "Auction Event"}
                          </h3>
                          <p className="text-xs sm:text-sm">
                            {data?.data?.[0]?.description ||
                              "No description available."}
                          </p>
                          <div className="text-md mt-4 ">
                            <p className="sm:text-md text-xs font-bold text-white">
                              Auction Period
                            </p>
                            <p className="text-sm font-light">
                              {data?.data?.[0]?.start_datetime
                                ? format(
                                    new Date(data.data[0].start_datetime),
                                    "E, dd MMMM yyyy | HH:mm O",
                                  )
                                : "Unknown Start Date"}{" "}
                            </p>
                            <p className="text-sm font-light">
                              {data?.data?.[0]?.end_datetime
                                ? format(
                                    new Date(data.data[0].end_datetime),
                                    "E, dd MMMM yyyy | HH:mm O",
                                  )
                                : "Unknown End Date"}
                            </p>
                          </div>
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
      <ContactInfo />
    </main>
  );
};

export default LandingPage;
