import { AuctionParticipant } from "./auctionParticipantTypes";

export enum AuctionOrderBy {
  AUCTION_ID = "auction_id",
  TITLE = "title",
  DESCRIPTION = "description",
  ITEM = "item",
  START_DATETIME = "start_datetime",
  END_DATETIME = "end_datetime",
  STATUS = "status",
  CURRENT_HIGHEST_BID = "current_highest_bid",
  RESERVE_PRICE = "reserve_price",
  BID_INCREMENT = "bid_increment",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
  CREATED_BY_ID = "created_by_id",
}
export interface FetchAllAuctionsParams {
  token: string;
  page?: number;
  limit?: number;
  status?: AuctionStatus;
  startDateFrom?: Date;
  startDateTo?: Date;
  orderBy?: AuctionOrderBy;
  order?: "ASC" | "DESC";
}

export interface AuctionFilters {
  title?: string; // Filter by auction title
  description?: string; // Filter by auction description
  minReservePrice?: number; // Filter by minimum reserve price
  maxReservePrice?: number; // Filter by maximum reserve price
  startDateFrom?: Date; // Filter by auction start date (earliest)
  startDateTo?: Date; // Filter by auction start date (latest)
  status?: AuctionStatus;
  orderBy?: AuctionOrderBy;
  order?: "ASC" | "DESC";
}

interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  count: number;
  page: number;
  limit: number;
}

export type CreateAuctionBody = {
  title: string;
  description: string;
  item: string;
  reserve_price: number;
  bid_increment: number;
};

export type UpdateAuctionBody = {
  title?: string;
  description?: string;
  item?: string;
  start_datetime?: string;
  end_datetime?: string;
  reserve_price?: string;
  bid_increment?: string;
  status?: AuctionStatus;
};

interface User {
  user_id: string;
  username: string;
}

export interface Auction {
  auction_id: string;
  title: string;
  description: string;
  item: string;
  start_datetime: string;
  end_datetime: string;
  status: string;
  current_highest_bid: string;
  reserve_price: string;
  bid_increment: string;
  created_at: string;
  updated_at: string;
  user: User;
  bids: any[];
  participants: any[];
}

export type PaginatedAuctionsResponse = PaginatedResponse<Auction>;

export type AuctionByIDResponse = Omit<
  PaginatedResponse<Auction>,
  "count" | "page" | "limit"
>;

export interface AuctionTableData {
  auction_id: string;
  title: string;
  description: string;
  item: string;
  start_datetime: string;
  end_datetime: string;
  status: string;
  current_highest_bid: string;
  reserve_price: string;
  bid_increment: string;
  created_at: string;
  updated_at: string;
  user: string;
  bids: number;
  participants: AuctionParticipant[];
}

export enum AuctionStatus {
  DRAFT = "DRAFT", // default dari backend setelah create
  PENDING = "PENDING", // proses verifikasi ke buyer
  PUBLISHED = "PUBLISHED", // masuk auction listing (ready to be consumed by users) & can be cancelled
  COMPLETED = "COMPLETED", // verified by admin
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED", // triggered
  FAILED = "FAILED", // failed to be verified by admin (pending dan tidak di approve)
  STARTED = "STARTED",
  DELETED = "DELETED",
}

export const transformAuctionToTableData = (
  auction: Auction | null | undefined,
): AuctionTableData => {
  if (!auction) {
    return {
      auction_id: "",
      title: "",
      description: "",
      item: "",
      start_datetime: "",
      end_datetime: "",
      status: "",
      current_highest_bid: "0",
      reserve_price: "0",
      bid_increment: "0",
      created_at: "",
      updated_at: "",
      user: "N/A",
      bids: 0,
      participants: [],
    };
  }

  return {
    auction_id: auction.auction_id ?? "",
    title: auction.title ?? "",
    description: auction.description ?? "",
    item: auction.item ?? "",
    start_datetime: auction.start_datetime ?? "",
    end_datetime: auction.end_datetime ?? "",
    status: auction.status ?? "",
    current_highest_bid: auction.current_highest_bid ?? "0",
    reserve_price: auction.reserve_price ?? "0",
    bid_increment: auction.bid_increment ?? "0",
    created_at: auction.created_at ?? "",
    updated_at: auction.updated_at ?? "",
    user: auction.user?.username ?? "N/A",
    bids: auction.bids?.length ?? 0,
    participants: auction.participants ?? [],
  };
};
