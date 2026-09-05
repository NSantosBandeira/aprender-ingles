import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { upsertUser } from "./lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, profile }) {
      const email = user.email || (profile as { email?: string } | undefined)?.email;
      if (!email) {
        console.error("Google não enviou e-mail no login.");
        return false;
      }
      try {
        await upsertUser({
          id: user.id || email,
          email,
          name: user.name,
          image: user.image,
        });
        return true;
      } catch (error) {
        console.error("Falha ao salvar o usuário no Postgres:", error);
        return false;
      }
    },
  },
});
