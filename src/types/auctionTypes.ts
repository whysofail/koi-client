interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  count: number;
  page: number;
  limit: number;
}

export type AuctionBody = {
  title: string;
  description: string;
  item: string;
  start_datetime: Date;
  end_datetime: Date;
  reserve_price: number;
  bid_increment: number;
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
  bids: any[]; // TODO: Define Bid interface if needed
  participants: any[]; // TODO: Define Participant interface if needed
}

export type PaginatedAuctionsResponse = PaginatedResponse<Auction>;

export type AuctionByIDResponse = Omit<
  PaginatedResponse<Auction>,
  "count" | "page" | "limit"
>;

export interface AuctionTableData {
  auction_id: string; // Add this line
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
  user: string; // Just the username
  bids: number; // Count of bids
  participants: number; // Count of participants
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
      participants: 0,
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
    participants: auction.participants?.length ?? 0,
  };
};
