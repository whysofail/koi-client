import NextAuth from "next-auth/next";
import authOptions from "@/server/authOptions";

const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST };
