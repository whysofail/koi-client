export interface AuctionParticipant {
  auction_participant_id: string;
  joined_at: string; // ISO date string
  user: {
    user_id: string;
    username: string;
  };
  participants_count: number;
}
