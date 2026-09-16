import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

function productionAuthUrl() {
  if (process.env.AUTH_URL) return process.env.AUTH_URL.replace(/\/$/, "");
  if (!process.env.VERCEL) return;
  const host = (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "").replace(/^https?:\/\//, "");
  if (host) return `https://${host}`;
}

const authUrl = productionAuthUrl();
if (authUrl) process.env.AUTH_URL = authUrl;

const googleReady = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authConfig = {
  trustHost: true,
  providers: googleReady
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: { params: { scope: "openid email profile" } },
        }),
      ]
    : [],
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;
