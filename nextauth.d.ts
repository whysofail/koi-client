import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    accessToken: string;
    is_banned: boolean;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      accessToken: string;
      accessTokenExpires: number;
    } & DefaultSession["user"];
  }

  declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
      id: string;
      role: Role;
      accessToken: string;
      accessTokenExpires: number;
      exp?: number;
      iat?: number;
    }
  }
}
