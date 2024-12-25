import { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "nextauth";

type LoginResponse = {
  token: string;
  user: {
    user_id: string;
    name: string;
    email: string;
    role: Role;
  };
};
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const res = await fetch(`${process.env.BACKEND_URL}/api/login`, {
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
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.user_id,
        role: token.role as Role,
      },
    }),
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;
