export interface Bid {
  bid_id: string;
  bid_amount: string;
  bid_time: string;
  auction: {
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
  };
}

export interface BidWithUserAndAuction {
  bid_id: string;
  bid_amount: string;
  bid_time: string;
  auction: {
    auction_id: string;
    title: string;
  };
  user: {
    user_id: string;
    username: string;
    email: string;
  };
}

export interface PaginatedBidsResponse {
  status: string;
  message: string;
  data: BidWithUserAndAuction[];
  count: number;
  page: number;
  limit: number;
}

interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  count: number;
}

export type BidByIDResponse = Omit<PaginatedResponse<Bid>, "count">;

interface UserInBid {
  user_id: string;
  username: string;
  role: string;
  email: string;
  password: string;
  registration_date: string;
  last_update: string;
  is_banned: boolean;
}

interface DetailedAuctionInBid {
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
}

export interface DetailedBid {
  bid_id: string;
  bid_amount: string;
  bid_time: string;
  auction: DetailedAuctionInBid;
  user: UserInBid;
}

export interface LoggedInUserBidsResponse {
  status: string;
  message: string;
  data: DetailedBid[];
  count: number;
}
