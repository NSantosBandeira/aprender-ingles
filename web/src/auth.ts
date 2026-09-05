import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { upsertUser } from "./lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
});
