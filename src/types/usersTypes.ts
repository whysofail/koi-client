export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum UserOrderBy {
  USERNAME = "username",
  EMAIL = "email",
  BALANCE = "balance",
  IS_BANNED = "is_banned",
  REGISTRATION_DATE = "registration_date",
}
export interface FetchAllUsersParams {
  token: string;
  page?: number;
  limit?: number;
  role?: UserRole;
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
  isBanned?: boolean;
  orderBy: UserOrderBy;
  order: "ASC" | "DESC";
}

interface Wallet {
  wallet_id: string;
  balance: string;
}

interface UserData {
  user_id: string;
  username: string;
  role: string;
  email: string;
  registration_date: string;
  is_banned: boolean;
  wallet: Wallet;
}

export interface GetUserResponse {
  status: string;
  message: string;
  data: UserData;
}

export interface PaginatedUsersResponse {
  status: string;
  message: string;
  data: UserData[];
  count: number;
  page: number;
  limit: number;
}

export interface WarnUserBody {
  user_id: string;
  reason: string;
}
