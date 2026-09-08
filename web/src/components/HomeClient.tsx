"use client";

import { logout } from "@/app/logout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VoiceControls } from "./VoiceControls";
import { UnitsGrid } from "./UnitsGrid";
import { ThemeToggle } from "./ThemeToggle";
import { canListen, speakEnglish } from "@/lib/speech";
import { homeContent, unitProgress, type DailyHome } from "@/lib/content";
import { ROLES, type RoleId } from "@/lib/roles";
import type { Profile } from "@/lib/db";

export function HomeClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [showListenBanner, setShowListenBanner] = useState(false);
  const scores = profile.scores || {};
  const { daily, workActive, fundamentalsActive, review } = homeContent(
    profile.roles as RoleId[],
    scores,
    profile.completedAt || {}
  );
  const totals = [...(daily.status === "active" ? [daily.unit] : []), ...workActive, ...fundamentalsActive, ...review].reduce(
    (acc, unit) => {
      const progress = unitProgress(unit, scores);
      acc.done += progress.done;
      acc.total += progress.total;
      acc.stars += progress.stars;
      return acc;
    },
    { done: 0, total: 0, stars: 0 }
  );
  const roleLabels = ROLES.filter((role) => profile.roles.includes(role.id))
    .map((role) => role.title)
    .join(" · ");

  useEffect(() => {
    setShowListenBanner(!canListen());
  }, []);

  async function changeVoice(id: string) {
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voiceRate: id }),
    });
    await speakEnglish("Good morning.", { rateId: id });
    router.refresh();
  }

  return (
    <>
      <header className="top">
        <div className="user-row">
          <p className="eyebrow">Inglês do seu dia no time</p>
          <div className="header-actions">
            <ThemeToggle />
            <Link className="ghost-link" href="/revisar">
              Revisar{review.length ? ` (${review.length})` : ""}
            </Link>
            <form action={logout}>
              <button className="ghost" type="submit">
                Sair
              </button>
            </form>
          </div>
        </div>
        <h1>Fale e escreva no seu contexto.</h1>
        <p className="lead">
          Papel agora: <strong>{roleLabels || "nenhum"}</strong>.{" "}
          <Link href="/onboarding">Trocar papéis</Link>
        </p>
        <div className="stats">
          <div>
            <strong>{profile.xp}</strong>
            <span>pontos</span>
          </div>
          <div>
            <strong>
              {totals.done}/{totals.total}
            </strong>
            <span>frases</span>
          </div>
          <div>
            <strong>{totals.stars}</strong>
            <span>estrelas</span>
          </div>
        </div>
      </header>

      <VoiceControls selected={profile.voiceRate} onChange={changeVoice} />

      {showListenBanner ? (
        <p className="banner">Para a fala, use Chrome ou Edge e permita o microfone.</p>
      ) : null}

      <DailyBlock daily={daily} scores={scores} />

      <h2 className="section-title">Meu dia</h2>
      <UnitsGrid units={workActive} scores={scores} empty="Nenhuma outra cena para esses papéis ainda." />

      <h2 className="section-title">Fundamentos</h2>
      <UnitsGrid units={fundamentalsActive} scores={scores} empty="Nenhum fundamento pendente." />
    </>
  );
}

function DailyBlock({ daily, scores }: { daily: DailyHome; scores: Record<string, number> }) {
  if (daily.status === "none") return null;

  if (daily.status === "waiting") {
    return (
      <>
        <h2 className="section-title">
          Jornada daily · {daily.step - 1} de {daily.total}
        </h2>
        <article className="unit waiting">
          <div className="unit-top">
            <h3>{daily.next.title}</h3>
            <span>Amanhã</span>
          </div>
          <p>
            Você concluiu a daily de hoje. <strong>{daily.next.title}</strong> será liberada no próximo dia, com frases
            novas.
          </p>
        </article>
      </>
    );
  }

  if (daily.status === "finished") {
    return (
      <>
        <h2 className="section-title">Jornada daily · {daily.total} de {daily.total}</h2>
        <article className="unit complete">
          <div className="unit-top">
            <h3>Jornada concluída</h3>
            <span>Feito</span>
          </div>
          <p>
            Você passou pelas {daily.total} dailies. Pode refazer qualquer uma em{" "}
            <Link href="/revisar">Revisar</Link>.
          </p>
        </article>
      </>
    );
  }

  return (
    <>
      <h2 className="section-title">
        Jornada daily · {daily.step} de {daily.total}
      </h2>
      <UnitsGrid units={[daily.unit]} scores={scores} />
    </>
  );
}
