export const sharedRoutes = {
  base: [
    "/dashboard",
    "/dashboard/transactions",
    "/dashboard/transactions/[transactionsID]",
  ],
  profile: ["/dashboard/profile", "/dashboard/profile/settings"],
  notifications: ["/dashboard/notifications"],
};

export const roleSpecificRoutes = {
  admin: [
    "/dashboard/users",
    "/dashboard/users/[userID]",
    "/dashboard/inventory",
    "/dashboard/auctions",
    "/dashboard/auctions/add/[koiID]",
    "/dashboard/auctions/update/[auctionID]",
    "/dashboard/bids",
  ],
  user: ["/dashboard/profile-settings"],
} as const;
