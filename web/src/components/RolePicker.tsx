"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES, type RoleId } from "@/lib/roles";
import { DEFAULT_DAYS, DEFAULT_SPRINTS, dayRange, sprintRange } from "@/lib/projects";

export function RolePicker({
  initialRoles = [],
  sprintCount = DEFAULT_SPRINTS,
  sprintDays = DEFAULT_DAYS,
  setupLocked = false,
  projectConfigured = false,
}: {
  initialRoles?: string[];
  sprintCount?: number;
  sprintDays?: number;
  setupLocked?: boolean;
  projectConfigured?: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState<"roles" | "project">(initialRoles.length && !projectConfigured ? "project" : "roles");
  const [selected, setSelected] = useState<string[]>(initialRoles);
  const [sprints, setSprints] = useState(sprintCount);
  const [days, setDays] = useState(sprintDays);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggle(id: RoleId) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function goToProject() {
    if (!selected.length) {
      setError("Escolha pelo menos um papel.");
      return;
    }
    setError("");
    setStep("project");
  }

  async function save() {
    if (!selected.length) {
      setError("Escolha pelo menos um papel.");
      return;
    }
    setSaving(true);
    setError("");
    const payload: { roles: string[]; sprintCount?: number; sprintDays?: number } = { roles: selected };
    if (!setupLocked) {
      payload.sprintCount = sprints;
      payload.sprintDays = days;
    }
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (response.status === 409) {
      setError("A sprint já começou. Os números ficam travados até o projeto acabar.");
      return;
    }
    if (!response.ok) {
      setError("Não consegui salvar. Veja se o Postgres está no Docker.");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  if (step === "roles") {
    return (
      <section>
        <p className="eyebrow">Seu papel no time</p>
        <h1>O que você faz no trabalho?</h1>
        <p className="lead">Pode marcar mais de um. O app monta as cenas a partir disso.</p>
        <div className="units">
          {ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              className={`unit role-card ${selected.includes(role.id) ? "on" : ""}`}
              onClick={() => toggle(role.id)}
            >
              <h3>{role.title}</h3>
              <p>{role.blurb}</p>
            </button>
          ))}
        </div>
        {error ? <p className="banner">{error}</p> : null}
        <div className="pager">
          <span />
          <button className="hot" type="button" onClick={goToProject}>
            Continuar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <p className="eyebrow">Seu projeto</p>
      <h1>Como é a sprint no seu time?</h1>
      <p className="lead">
        {setupLocked
          ? "Esses números ficam travados enquanto o projeto está em andamento. Você ainda pode voltar e trocar os papéis."
          : "Planning no começo, uma daily por dia, review e retro no fim. Você escolhe o tamanho."}
      </p>

      <h2 className="section-title">Sprints neste projeto</h2>
      <div className="rate-pills">
        {sprintRange().map((n) => (
          <button
            key={n}
            type="button"
            className={sprints === n ? "on" : ""}
            disabled={setupLocked}
            onClick={() => setSprints(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: 28 }}>
        Dias por sprint
      </h2>
      <p className="hint">Cada dia é uma daily. Planning, review e retro entram além desses dias.</p>
      <div className="rate-pills">
        {dayRange().map((n) => (
          <button
            key={n}
            type="button"
            className={days === n ? "on" : ""}
            disabled={setupLocked}
            onClick={() => setDays(n)}
          >
            {n}
          </button>
        ))}
      </div>

      {error ? <p className="banner">{error}</p> : null}
      <div className="pager">
        <button className="ghost" type="button" onClick={() => setStep("roles")}>
          Voltar
        </button>
        <button className="hot" type="button" onClick={save} disabled={saving}>
          {saving ? "Salvando..." : "Continuar"}
        </button>
      </div>
    </section>
  );
}
