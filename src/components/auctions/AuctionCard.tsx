import Image from "next/image";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isValid, parseISO } from "date-fns";
import Link from "next/link";

interface AuctionCardProps {
  auction: any;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const { data: koiData, isLoading, error } = useGetKoiByID(auction.item || "");

  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
  const imageArray = koiData?.photo?.split("|") || [];
  const imageUrl = imageArray[0] ? `${imageBaseUrl}${imageArray[0]}` : "";

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      return isValid(date)
        ? format(date, "dd MMM yyyy, HH:mm")
        : "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="rounded-xl bg-[#E8D5B0] p-4 dark:bg-[#6a5c41] dark:text-gray-100">
      <div className="relative mb-2 aspect-square">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : error || !imageUrl ? (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-blue-100 text-sm text-gray-500">
            No image available
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={auction.title || "Koi fish"}
            width={400}
            height={400}
            className="rounded-lg bg-blue-500"
          />
        )}
      </div>
      <Link
        className="mb-2 text-lg font-medium"
        href={`/auctions/${auction.auction_id}`}
      >
        {auction.title}
      </Link>
      <div className="mb-2 flex justify-between text-sm">
        <span>{auction.bids.length || 0} Bids</span>
        <span>{formatDate(auction.end_datetime)}</span>
      </div>
      <div className="mb-3 font-bold">
        Rp. {Number(auction.buynow_price || 0).toLocaleString()}
      </div>
    </div>
  );
}
