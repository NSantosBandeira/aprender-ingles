"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function MarketingHeader({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();

  function navClass(href: string) {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return active ? "site-nav-link on" : "site-nav-link";
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-logo" href="/">
          Inglês no Trabalho
        </Link>
        <nav className="site-nav" aria-label="Principal">
          <Link className={navClass("/")} href="/">
            Home
          </Link>
          <Link className={navClass("/sobre")} href="/sobre">
            Sobre
          </Link>
          <ThemeToggle />
          {loggedIn ? (
            <Link className="site-nav-cta" href="/app">
              Ir para o meu dia
            </Link>
          ) : (
            <>
              <Link className={navClass("/login")} href="/login">
                Entrar
              </Link>
              <Link className="site-nav-cta" href="/cadastro">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
