interface Wallet {
  wallet_id: string;
  user_id: string;
  balance: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  user_id: string;
  username: string;
  role: string;
  email: string;
  password: string;
  registration_date: string;
  last_update: string;
  wallet: Wallet;
}

export interface GetUserResponse {
  status: string;
  message: string;
  data: UserData;
}
