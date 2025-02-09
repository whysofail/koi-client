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

interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  count: number;
}

export type BidByIDResponse = Omit<PaginatedResponse<Bid>, "count">;
