import { DefaultSession } from "next-auth";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

declare module "next-auth" {
  interface User {
    email: string;
    name: string;
    role: Role;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}
