import { auth } from "@/auth";
import { MarketingHeader } from "@/components/MarketingHeader";
import Link from "next/link";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="site">
      <MarketingHeader loggedIn={Boolean(session?.user)} />
      {children}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>Inglês no Trabalho · prática de inglês no dia do time</p>
          <p>
            <Link href="/">Home</Link>
            <Link href="/sobre">Sobre</Link>
            {session?.user ? (
              <Link href="/app">Meu dia</Link>
            ) : (
              <>
                <Link href="/login">Entrar</Link>
                <Link href="/cadastro">Cadastrar</Link>
              </>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
