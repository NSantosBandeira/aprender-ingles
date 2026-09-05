import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const googleReady = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authConfig = {
  trustHost: true,
  providers: googleReady
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : [],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
