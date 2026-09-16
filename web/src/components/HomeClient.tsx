"use client";

import { logout } from "@/app/logout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VoiceControls } from "./VoiceControls";
import { UnitsGrid } from "./UnitsGrid";
import { ThemeToggle } from "./ThemeToggle";
import { BrandMark } from "./BrandMark";
import { canListen, speakEnglish } from "@/lib/speech";
import { homeContent, phaseLabel, sprintContextFrom, unitProgress, type SprintHome } from "@/lib/content";
import { ROLES, type RoleId } from "@/lib/roles";
import type { Profile } from "@/lib/db";

export function HomeClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [showListenBanner, setShowListenBanner] = useState(false);
  const ctx = sprintContextFrom({
    roles: profile.roles as RoleId[],
    scores: profile.scores,
    completedAt: profile.completedAt,
    sprintCount: profile.sprintCount,
    sprintDays: profile.sprintDays,
    currentProject: profile.currentProject,
  });
  const scores = ctx.scores;
  const { sprintHome, workActive, fundamentalsActive, review, sprintTrack } = homeContent(ctx);
  const totals = [...sprintTrack, ...fundamentalsActive, ...review.filter((unit) => unit.track === "fundamentals")].reduce(
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
  const phase = phaseLabel(sprintHome);

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
          <div className="app-brand">
            <BrandMark size={28} />
            <p className="eyebrow">
              Projeto {profile.currentProject} · Sprint {sprintHome.sprint} de {sprintHome.sprintCount}
              {phase ? ` · ${phase}` : ""}
            </p>
          </div>
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

      <SprintBlock home={sprintHome} scores={scores} />

      {workActive.length ? (
        <>
          <h2 className="section-title">Meu dia</h2>
          <UnitsGrid units={workActive} scores={scores} />
        </>
      ) : null}

      <h2 className="section-title">Fundamentos</h2>
      <UnitsGrid units={fundamentalsActive} scores={scores} empty="Nenhum fundamento pendente." />
    </>
  );
}

function SprintBlock({ home, scores }: { home: SprintHome; scores: Record<string, number> }) {
  if (home.status === "none") return null;

  if (home.status === "waiting-daily") {
    return (
      <>
        <h2 className="section-title">
          Daily · {home.day - 1} de {home.sprintDays}
        </h2>
        <article className="unit waiting">
          <div className="unit-top">
            <h3>{home.next.title}</h3>
            <span>Amanhã</span>
          </div>
          <p>
            Você concluiu a daily de hoje. <strong>{home.next.title}</strong> será liberada no próximo dia.
          </p>
        </article>
      </>
    );
  }

  if (home.status === "waiting-sprint") {
    return (
      <>
        <h2 className="section-title">
          Sprint {home.sprint} de {home.sprintCount}
        </h2>
        <article className="unit waiting">
          <div className="unit-top">
            <h3>Sprint {home.nextSprint} começa amanhã</h3>
            <span>Amanhã</span>
          </div>
          <p>
            Você fechou a Sprint {home.sprint}. O planning da Sprint {home.nextSprint} abre no próximo dia.
          </p>
        </article>
      </>
    );
  }

  if (home.status === "project-done") {
    return (
      <>
        <h2 className="section-title">Projeto concluído</h2>
        <article className="unit complete">
          <div className="unit-top">
            <h3>Você subiu de nível</h3>
            <span>Feito</span>
          </div>
          <p>
            As {home.sprintCount} sprints deste projeto estão concluídas. O Projeto 2 chega em breve. Enquanto isso,
            os fundamentos continuam aqui e as cenas feitas estão em <Link href="/revisar">Revisar</Link>.
          </p>
        </article>
      </>
    );
  }

  const titles: Record<"planning" | "daily" | "review" | "retro", string> = {
    planning: "Sprint planning",
    daily: `Daily · ${home.status === "daily" ? home.day : 1} de ${home.sprintDays}`,
    review: "Sprint review",
    retro: "Retrospectiva",
  };

  return (
    <>
      <h2 className="section-title">{titles[home.status]}</h2>
      <UnitsGrid units={[home.unit]} scores={scores} />
    </>
  );
}
