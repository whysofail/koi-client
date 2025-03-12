import { http, HttpResponse, delay } from "msw";
import { parseISO, isWithinInterval } from "date-fns";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";
import { mockAuctions } from "../data/auctionData";

export const auctionsHandlers = [
  http.get("/api/auctions", async ({ request }) => {
    await delay();

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new HttpResponse(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status") as AuctionStatus;
    const startDateFrom = url.searchParams.get("startDateFrom");
    const startDateTo = url.searchParams.get("startDateTo");
    const orderBy =
      (url.searchParams.get("orderBy") as AuctionOrderBy) ||
      AuctionOrderBy.CREATED_AT;
    const order = url.searchParams.get("order") || "DESC";

    let filteredAuctions = [...mockAuctions];

    if (status) {
      filteredAuctions = filteredAuctions.filter(
        (auction) => auction.status === status,
      );
    }

    if (startDateFrom || startDateTo) {
      filteredAuctions = filteredAuctions.filter((auction) => {
        const auctionDate = parseISO(auction.start_datetime);
        return isWithinInterval(auctionDate, {
          start: startDateFrom ? parseISO(startDateFrom) : new Date(0),
          end: startDateTo ? parseISO(startDateTo) : new Date(),
        });
      });
    }

    filteredAuctions.sort((a, b) => {
      let compareA, compareB;

      switch (orderBy) {
        case AuctionOrderBy.AUCTION_ID:
          compareA = a.auction_id;
          compareB = b.auction_id;
          break;
        case AuctionOrderBy.TITLE:
          compareA = a.title;
          compareB = b.title;
          break;
        case AuctionOrderBy.DESCRIPTION:
          compareA = a.description;
          compareB = b.description;
          break;
        case AuctionOrderBy.ITEM:
          compareA = a.item;
          compareB = b.item;
          break;
        case AuctionOrderBy.START_DATETIME:
          compareA = a.start_datetime;
          compareB = b.start_datetime;
          break;
        case AuctionOrderBy.END_DATETIME:
          compareA = a.end_datetime;
          compareB = b.end_datetime;
          break;
        case AuctionOrderBy.STATUS:
          compareA = a.status;
          compareB = b.status;
          break;
        case AuctionOrderBy.CURRENT_HIGHEST_BID:
          compareA = parseFloat(a.current_highest_bid);
          compareB = parseFloat(b.current_highest_bid);
          break;
        case AuctionOrderBy.BUYNOW_PRICE:
          compareA = parseFloat(a.buynow_price);
          compareB = parseFloat(b.buynow_price);
          break;
        case AuctionOrderBy.BID_INCREMENT:
          compareA = parseFloat(a.bid_increment);
          compareB = parseFloat(b.bid_increment);
          break;
        case AuctionOrderBy.CREATED_BY_ID:
          compareA = a.user.user_id;
          compareB = b.user.user_id;
          break;
        case AuctionOrderBy.CREATED_AT:
        default:
          compareA = a.created_at;
          compareB = b.created_at;
      }

      const comparison = compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      return order === "ASC" ? comparison : -comparison;
    });

    const start = (page - 1) * limit;
    const paginatedAuctions = filteredAuctions.slice(start, start + limit);

    return HttpResponse.json({
      status: "success",
      message: "Auctions retrieved successfully",
      data: paginatedAuctions,
      count: filteredAuctions.length,
      page,
      limit,
    });
  }),
];
