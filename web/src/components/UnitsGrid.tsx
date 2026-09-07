"use client";

import Link from "next/link";
import { unitProgress, type Unit } from "@/lib/content";

export function UnitsGrid({
  units,
  scores,
  empty,
  completed = false,
}: {
  units: Unit[];
  scores: Record<string, number>;
  empty?: string;
  completed?: boolean;
}) {
  if (!units.length) return empty ? <p className="hint">{empty}</p> : null;
  return (
    <div className="units">
      {units.map((unit) => {
        const progress = unitProgress(unit, scores);
        const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
        return (
          <article className={`unit${completed ? " complete" : ""}`} key={unit.id}>
            <div className="unit-top">
              <h3>{unit.title}</h3>
              <span>{completed ? "Concluída" : `${progress.done}/${progress.total}`}</span>
            </div>
            <p>{unit.blurb}</p>
            <div className="bar">
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className="unit-actions">
              <Link href={`/practice/${unit.id}/speak`}>{completed ? "Refazer fala" : "Falar"}</Link>
              <Link className="ghost" href={`/practice/${unit.id}/write`}>
                {completed ? "Refazer escrita" : "Escrever"}
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
