"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES, type RoleId } from "@/lib/roles";

export function RolePicker({ initialRoles = [] }: { initialRoles?: string[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initialRoles);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggle(id: RoleId) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function save() {
    if (!selected.length) {
      setError("Escolha pelo menos um papel.");
      return;
    }
    setSaving(true);
    setError("");
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roles: selected }),
    });
    setSaving(false);
    if (!response.ok) {
      setError("Não consegui salvar. Veja se o Postgres está no Docker.");
      return;
    }
    router.push("/");
    router.refresh();
  }

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
        <button className="hot" type="button" onClick={save} disabled={saving}>
          {saving ? "Salvando..." : "Continuar"}
        </button>
      </div>
    </section>
  );
}
