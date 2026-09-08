import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Cadastrar",
};

export default function RegisterPage() {
  const googleReady = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <main className="site-main site-auth">
      <p className="eyebrow">Inglês no trabalho</p>
      <h1>Crie sua conta.</h1>
      <p className="lead">Cadastre-se com e-mail e senha para montar o inglês do seu dia no time.</p>
      <RegisterForm />
      {googleReady ? <p className="auth-or">ou</p> : null}
      <GoogleSignIn ready={googleReady} label="Cadastrar com Google" />
      <p className="auth-switch">
        Já tem conta? <Link href="/login">Entrar</Link>
      </p>
    </main>
  );
}
