import { Wallet } from "./walletTypes";

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

interface BasicWallet {
  wallet_id: string;
  balance: string;
}

interface BasicUserData {
  user_id: string;
  username: string;
  role: string;
  email: string;
  registration_date: string;
  is_banned: boolean;
  wallet: BasicWallet | null;
}

interface UserWarning {
  warning_id: string;
  reason: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
}

interface UserData {
  user_id: string;
  username: string;
  role: string;
  email: string;
  password: string;
  phone: string;
  registration_date: string;
  last_update: string;
  is_banned: boolean;
  wallet: Wallet;
  warnings: UserWarning[];
}

interface DetailedUserData {
  user_id: string;
  username: string;
  role: string;
  email: string;
  password: string;
  registration_date: string;
  last_update: string;
  is_banned: boolean;
  wallet: Wallet;
  warnings: UserWarning[];
}

export interface GetUserResponse {
  status: string;
  message: string;
  data: DetailedUserData;
}

export interface PaginatedUsersResponse {
  status: string;
  message: string;
  data: BasicUserData[];
  count: number;
  page: number;
  limit: number;
}

export interface WarnUserBody {
  user_id: string;
  reason: string;
}

interface WarningUser {
  user_id: string;
  username: string;
  is_banned: boolean;
}

interface Warning {
  warning_id: string;
  reason: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  user: WarningUser;
}

export interface CreateAdminUserBody {
  username: string;
  email: string;
  password: string;
}

export interface GetUserWarningsResponse {
  status: string;
  message: string;
  data: Warning[];
  count: number;
}

export interface DetailedUserWarning {
  warning_id: string;
  reason: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
}

interface DetailedUserData extends UserData {
  password: string;
  last_update: string;
  warnings: DetailedUserWarning[];
}

export interface GetDetailedUserResponse {
  status: string;
  message: string;
  data: DetailedUserData;
}

export interface UsersTableData {
  user_id: string;
  username: string;
  email: string;
  wallet: {
    balance: string;
  } | null;
  is_banned: boolean;
  registration_date: string;
}

export const transformUserToTableData = (
  user: BasicUserData | null | undefined,
): UsersTableData => {
  if (!user) {
    return {
      user_id: "",
      username: "",
      email: "",
      wallet: null,
      is_banned: false,
      registration_date: "",
    };
  }

  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    wallet: user.wallet,
    is_banned: user.is_banned,
    registration_date: user.registration_date,
  };
};
