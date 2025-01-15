import { jwtDecode } from "jwt-decode";
import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { Role } from "nextauth";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    user_id: string;
    name: string;
    email: string;
    role: Role;
  };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!res.ok) {
            return null;
          }
          const data = (await res.json()) as LoginResponse;
          return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            id: data.user.user_id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    jwt: async ({ token, user }): Promise<JWT> => {
      if (user) {
        const decoded = jwtDecode<{ exp: number }>(user.accessToken);
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          exp: decoded.exp,
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        };
      }

      if (token.exp && Date.now() < token.exp * 1000) {
        return token;
      }

      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token.refreshToken}`,
            },
          },
        );

        const tokens = await response.json();

        if (!response.ok) throw tokens;

        const decoded = jwtDecode<{ exp: number }>(tokens.accessToken);

        return {
          ...token,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken ?? token.refreshToken,
          exp: decoded.exp,
          error: undefined,
        };
      } catch (error) {
        console.error("Error refreshing access token:", error);
        return { ...token, error: "RefreshTokenError" };
      }
    },
    session: async ({ session, token }): Promise<Session> => {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            role: token.role as Role,
            accessToken: token.accessToken as string,
          },
        };
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.APP_ENV === "local",
});
