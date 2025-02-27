import { useState, useEffect } from "react";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import { formatDistance } from "date-fns";
import { AuctionOrderBy } from "@/types/auctionTypes";
import { formatCurrency } from "@/lib/formatCurrency";

const ActiveAuctionsViewModel = (
  token: string,
  limit: number,
  orderBy: AuctionOrderBy,
) => {
  const { data, isLoading, isError } = useGetAllAuctions({
    token,
    limit,
    orderBy,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const ActiveAuctionsData = data?.data;

  const formatTimeRemaining = (dateString: string) => {
    const endDate = new Date(dateString);

    if (isNaN(endDate.getTime())) {
      return "Invalid date";
    }

    if (endDate < currentTime) {
      return "Ended";
    }

    return formatDistance(currentTime, endDate) + " left";
  };

  return {
    ActiveAuctionsData,
    formatTimeRemaining,
    formatCurrency,
    isError,
    isLoading,
  };
};

export default ActiveAuctionsViewModel;
