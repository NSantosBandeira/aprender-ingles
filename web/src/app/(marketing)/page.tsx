import Image from "next/image";
import Link from "next/link";
import { ROLES } from "@/lib/roles";

const SCENES = [
  { title: "Daily", text: "Yesterday, today e blockers — o que você já fala no stand-up." },
  { title: "Sprint planning", text: "Estimativa, capacidade e o que entra na sprint." },
  { title: "Refinement", text: "Histórias, dúvidas e alinhamento com o time." },
  { title: "Review e demo", text: "Mostrar o que ficou pronto para o time e para o cliente." },
  { title: "Retrospectiva", text: "O que foi bem, o que melhorar e o próximo passo." },
  { title: "1:1", text: "Feedback, apoio e conversa com liderança." },
  { title: "Call com cliente", text: "Status, prazo e o próximo passo com clareza." },
  { title: "Slack e e-mail", text: "Mensagens curtas de status, pedido de ajuda e follow-up." },
];

export default function MarketingHomePage() {
  return (
    <main className="site-main">
      <section className="site-hero">
        <div>
          <p className="eyebrow">Inglês no trabalho</p>
          <h1>O inglês do seu dia no time.</h1>
          <p className="lead">
            Treine fala e escrita para daily, 1:1, Scrum e call com cliente — no contexto do que você já faz no
            trabalho.
          </p>
          <div className="site-hero-actions">
            <Link className="site-btn-hot" href="/cadastro">
              Começar grátis
            </Link>
            <Link className="site-btn-ghost" href="/sobre">
              Conhecer a plataforma
            </Link>
          </div>
        </div>
        <Image
          className="site-hero-image"
          src="/marketing/hero-standup.png"
          alt="Time em uma daily standup no escritório"
          width={1280}
          height={720}
          priority
        />
      </section>

      <section className="site-section">
        <p className="eyebrow">Como funciona</p>
        <h2>Fale e escreva no seu contexto.</h2>
        <p className="lead">Duas formas de praticar as mesmas cenas do dia a dia.</p>
        <div className="site-split">
          <article className="site-card">
            <Image
              src="/marketing/mode-speak.png"
              alt="Pessoa praticando fala em inglês no trabalho"
              width={800}
              height={600}
            />
            <p className="mode-kicker">Falar</p>
            <h3>A daily em voz alta</h3>
            <p>Você fala as frases da reunião. O app escuta, compara e mostra o que ajustar.</p>
          </article>
          <article className="site-card">
            <Image
              src="/marketing/mode-write.png"
              alt="Pessoa escrevendo uma mensagem de trabalho em inglês"
              width={800}
              height={600}
            />
            <p className="mode-kicker">Escrever</p>
            <h3>Slack, e-mail e status</h3>
            <p>Escreva o que diria no chat ou na call. Há dica, modelo e correção na hora.</p>
          </article>
        </div>
      </section>

      <section className="site-section">
        <p className="eyebrow">Seu papel</p>
        <h2>O estudo segue o que você faz no time.</h2>
        <p className="lead">Escolha um ou mais papéis. As cenas mudam com isso.</p>
        <div className="site-roles">
          {ROLES.map((role) => (
            <article className="site-card compact" key={role.id}>
              <h3>{role.title}</h3>
              <p>{role.blurb}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section">
        <div className="site-scene-intro">
          <div>
            <p className="eyebrow">No dia a dia</p>
            <h2>As mesmas conversas da sprint.</h2>
            <p className="lead">
              Não é um curso genérico. São frases de planning, demo, 1:1 e cliente — o inglês que aparece no trabalho.
            </p>
          </div>
          <Image
            className="site-scene-image"
            src="/marketing/scene-client.png"
            alt="Call de trabalho com cliente em inglês"
            width={800}
            height={600}
          />
        </div>
        <div className="site-scenes">
          {SCENES.map((scene) => (
            <article className="site-card compact" key={scene.title}>
              <h3>{scene.title}</h3>
              <p>{scene.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-cta">
        <p className="eyebrow">Pronto para praticar</p>
        <h2>Monte o seu dia em inglês.</h2>
        <p className="lead">Crie a conta e escolha seu papel. O app monta as cenas a partir disso.</p>
        <div className="site-hero-actions">
          <Link className="site-btn-hot" href="/cadastro">
            Cadastrar
          </Link>
          <Link className="site-btn-ghost" href="/login">
            Já tenho conta
          </Link>
        </div>
      </section>
    </main>
  );
}
