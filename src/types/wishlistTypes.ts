import { Auction } from "./auctionTypes";

export interface Wishlist {
  wishlist_id: string;
  user_id: string;
  auction_id: string;
  auction: Auction;
  created_at: string;
  updated_at: string;
}
