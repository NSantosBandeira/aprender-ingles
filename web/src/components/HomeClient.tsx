"use client";

import { logout } from "@/app/logout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VoiceControls } from "./VoiceControls";
import { canListen, speakEnglish } from "@/lib/speech";
import { unitProgress, type Unit } from "@/lib/content";
import { ROLES } from "@/lib/roles";
import type { Profile } from "@/lib/db";

export function HomeClient({
  profile,
  work,
  fundamentals,
}: {
  profile: Profile;
  work: Unit[];
  fundamentals: Unit[];
}) {
  const router = useRouter();
  const scores = profile.scores || {};
  const totals = [...work, ...fundamentals].reduce(
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
          <form action={logout}>
            <button className="ghost" type="submit">
              Sair
            </button>
          </form>
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

      {!canListen() ? (
        <p className="banner">Para a fala, use Chrome ou Edge e permita o microfone.</p>
      ) : null}

      <h2 className="section-title">Meu dia</h2>
      <UnitGrid units={work} scores={scores} empty="Nenhuma cena para esses papéis ainda." />

      <h2 className="section-title">Fundamentos</h2>
      <UnitGrid units={fundamentals} scores={scores} />
    </>
  );
}

function UnitGrid({
  units,
  scores,
  empty,
}: {
  units: Unit[];
  scores: Record<string, number>;
  empty?: string;
}) {
  if (!units.length) return <p className="hint">{empty}</p>;
  return (
    <div className="units">
      {units.map((unit) => {
        const progress = unitProgress(unit, scores);
        const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
        return (
          <article className="unit" key={unit.id}>
            <div className="unit-top">
              <h3>{unit.title}</h3>
              <span>
                {progress.done}/{progress.total}
              </span>
            </div>
            <p>{unit.blurb}</p>
            <div className="bar">
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className="unit-actions">
              <Link href={`/practice/${unit.id}/speak`}>Falar</Link>
              <Link className="ghost" href={`/practice/${unit.id}/write`}>
                Escrever
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
