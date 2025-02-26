export interface Wallet {
  wallet_id: string;
  user_id: string;
  balance: string;
  created_at: string;
  updated_at: string;
}

export interface GetDetailedWalletResponse {
  status: string;
  message: string;
  data: Wallet;
}

export interface createDepositBody {
  amount: string;
  proof_of_payment: File;
}
