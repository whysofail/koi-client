import { Auction } from "./auctionTypes";
import { Bid } from "./bidTypes";

export interface AuctionParticipant {
  auction_participant_id: string;
  joined_at: string; // ISO date string
  user: {
    user_id: string;
    username: string;
  };
}

export interface AuctionParticipantInfo {
  auction_participant_id: string;
  joined_at: string;
  user: {
    user_id: string;
    username: string;
  };
}

export interface JoinedAuctionParticipant {
  auction_participant_id: string;
  joined_at: string; // ISO date string
  auction: Auction;
  bids: Bid[];
  lastBid: Bid | null;
}

export interface JoinedAuctionParticipantResponse {
  status: string;
  message: string;
  data: JoinedAuctionParticipant[];
  count: number;
  page: number;
  limit: number;
}
