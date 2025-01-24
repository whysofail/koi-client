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

export type PaginatedAuctionsResponse = PaginatedResponse<User>;

export type GetAuctionByIDResponse = Omit<
  PaginatedResponse<User>,
  "count" | "page" | "limit"
>;
