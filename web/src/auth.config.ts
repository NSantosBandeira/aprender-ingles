import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

if (process.env.VERCEL) {
  const host = (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "").replace(/^https?:\/\//, "");
  if (host) process.env.AUTH_URL = `https://${host}`;
}

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
