import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { getUserAuthByEmail, upsertUser } from "./lib/db";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = asString(credentials?.email).toLowerCase();
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;
        const user = await getUserAuthByEmail(email);
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  session: { strategy: "jwt" },
  logger: {
    error(error) {
      console.error("Auth.js:", error);
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") return true;
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
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      if (token.email && session.user) session.user.email = token.email as string;
      return session;
    },
  },
});
