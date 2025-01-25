interface Wallet {
  wallet_id: string;
  balance: string;
}

interface User {
  user_id: string;
  username: string;
  role: string;
  email: string;
  registration_date: string;
  wallet: Wallet;
}

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
  item: number;
  start_datetime: Date;
  end_datetime: Date;
  reserve_price: number;
  bid_increment: number;
};

export type PaginatedAuctionsResponse = PaginatedResponse<User>;

export type GetAuctionByIDResponse = Omit<
  PaginatedResponse<User>,
  "count" | "page" | "limit"
>;
