import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
};

export default function AboutPage() {
  return (
    <main className="site-main">
      <section className="site-hero about">
        <div>
          <p className="eyebrow">Sobre</p>
          <h1>Inglês para o trabalho que você já faz.</h1>
          <p className="lead">
            A plataforma nasceu para quem vive daily, Scrum, 1:1 e call com cliente — e precisa do inglês nessas
            horas, não em um curso genérico.
          </p>
        </div>
        <Image
          className="site-hero-image"
          src="/marketing/about-team.png"
          alt="Time de produto colaborando em um quadro de sprint"
          width={1280}
          height={720}
          priority
        />
      </section>

      <section className="site-section">
        <p className="eyebrow">Para quem é</p>
        <h2>Quem fala com o time em inglês.</h2>
        <div className="site-split">
          <article className="site-card compact">
            <h3>Times de produto e engenharia</h3>
            <p>
              Desenvolvedores, tech leads, Scrum Masters, Product Owners e gestores praticam as frases do próprio
              papel.
            </p>
          </article>
          <article className="site-card compact">
            <h3>Quem já entende, mas trava na hora</h3>
            <p>
              O foco é fluência situacional: dizer ontem, hoje e blockers; pedir ajuda; dar status ao cliente.
            </p>
          </article>
        </div>
      </section>

      <section className="site-section">
        <p className="eyebrow">Como estudamos</p>
        <h2>Prática curta, no contexto real.</h2>
        <div className="site-scenes">
          <article className="site-card compact">
            <h3>Você escolhe o papel</h3>
            <p>O app monta daily, cerimônias, 1:1 e cliente a partir do que você faz no time.</p>
          </article>
          <article className="site-card compact">
            <h3>Fala e escrita</h3>
            <p>Treine em voz alta ou escreva o que diria no Slack, no e-mail ou na reunião.</p>
          </article>
          <article className="site-card compact">
            <h3>Um pouco por dia</h3>
            <p>A jornada daily libera uma cena por vez, para caber na rotina de trabalho.</p>
          </article>
          <article className="site-card compact">
            <h3>Revisão quando quiser</h3>
            <p>Cenas concluídas ficam em Revisar, para refazer fala ou escrita sem perder o ritmo.</p>
          </article>
        </div>
      </section>

      <section className="site-cta">
        <p className="eyebrow">Comece pelo seu dia</p>
        <h2>Crie a conta e monte as cenas.</h2>
        <p className="lead">Cadastro com e-mail e senha, ou entre com o Google.</p>
        <div className="site-hero-actions">
          <Link className="site-btn-hot" href="/cadastro">
            Cadastrar
          </Link>
          <Link className="site-btn-ghost" href="/login">
            Entrar
          </Link>
        </div>
      </section>
    </main>
  );
}
