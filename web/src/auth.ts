import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUser } from "./lib/db";

const googleReady = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: googleReady
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : [],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await upsertUser({
        id: user.id || user.email,
        email: user.email,
        name: user.name,
        image: user.image,
      });
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});
