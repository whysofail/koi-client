import { jwtDecode } from "jwt-decode";
import NextAuth, { type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "nextauth";

type LoginResponse = {
  accessToken: string;
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
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (res.status === 401) {
            throw new Error("CredentialsSignin");
          }

          if (!res.ok) {
            throw new Error("Failed to sign in");
          }

          const data = (await res.json()) as LoginResponse;
          return {
            accessToken: data.accessToken,
            id: data.user.user_id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
          };
        } catch (error) {
          throw error;
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
    jwt: async ({ token, user, account }) => {
      if (account && user) {
        const decoded = jwtDecode(user.accessToken);
        return {
          ...token,
          accessToken: user.accessToken,
          accessTokenExpires: decoded.exp,
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        };
      }
      return token;
    },
    session: async ({ session, token }): Promise<Session> => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as Role,
          accessToken: token.accessToken as string,
          accessTokenExpires: token.accessTokenExpires as number,
        },
      };
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  debug: process.env.APP_ENV === "local",
});
