import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { passwordLogin } from "@/lib/auth-actions";

export const metadata: Metadata = {
  title: "Entrar",
};

const AUTH_ERRORS: Record<string, string> = {
  AccessDenied:
    "O Google autenticou, mas o app não conseguiu gravar seu usuário no banco. Na Vercel, DATABASE_URL precisa ser o Postgres da nuvem (não localhost) e a tabela users é criada no primeiro login.",
  Configuration: "Falta configurar AUTH_SECRET, Google ou DATABASE_URL neste deploy.",
  OAuthCallback: "O retorno do Google falhou. Confira o redirect https://seu-app.vercel.app/api/auth/callback/google.",
  CredentialsSignin: "E-mail ou senha incorretos.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const googleReady = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const { error } = await searchParams;
  const errorMessage = error ? AUTH_ERRORS[error] || "Não foi possível entrar. Tente de novo." : null;

  return (
    <main className="site-main site-auth">
      <p className="eyebrow">Inglês no trabalho</p>
      <h1>Entre na sua conta.</h1>
      <p className="lead">Continue o inglês da daily, do 1:1 e da call com cliente.</p>
      {errorMessage ? <p className="banner">{errorMessage}</p> : null}
      <form className="auth-form" action={passwordLogin}>
        <label>
          E-mail
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Senha
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className="hot" type="submit">
          Entrar
        </button>
      </form>
      {googleReady ? <p className="auth-or">ou</p> : null}
      <GoogleSignIn ready={googleReady} label="Entrar com Google" />
      <p className="auth-switch">
        Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </main>
  );
}
