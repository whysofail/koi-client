export interface GetStatsResponse {
  data: {
    userTotal: number;
    userTotalThisWeek: number;
    auctionsActive: number;
    auctionsEndingSoon: number;
    depositsTotal: number;
    depositsPendingTotal: number;
  };
}
