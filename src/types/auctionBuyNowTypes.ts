export enum AuctionBuyNowStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface UserDetails {
  user_id: string;
  username: string;
  email?: string;
}

export interface AuctionDetails {
  auction_id: string;
  title: string;
  buynow_price: string;
}

export interface AuctionBuyNow {
  auction_buynow_id: string;
  auction_id: string;
  buyer_id?: string;
  buyer?: UserDetails;
  admin_id?: string;
  admin?: UserDetails;
  status: AuctionBuyNowStatus;
  transaction_reference?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  auction: AuctionDetails;
}

export enum BuyNowOrderBy {
  STATUS = "status",
  CREATED_AT = "created_at",
}

export type FetchAllBuyNowParams = {
  token: string;
  page?: number;
  limit?: number;
  status?: AuctionBuyNowStatus;
  createdFrom?: Date;
  createdTo?: Date;
  orderBy?: BuyNowOrderBy;
  order?: "ASC" | "DESC";
};

export interface AuctionBuyNowWithDetails {
  auction_buynow_id: string;
  auction: AuctionDetails;
  buyer: UserDetails;
  status: AuctionBuyNowStatus;
  created_at: string;
}

export interface AuctionBuyNowResponse {
  status: string;
  message: string;
  data: AuctionBuyNowWithDetails[];
  count: number;
}
