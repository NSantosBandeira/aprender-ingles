"use client";

import { SPEAK_RATES } from "@/lib/speech";

export function VoiceControls({
  compact = false,
  selected,
  onChange,
}: {
  compact?: boolean;
  selected: string;
  onChange: (id: string) => void;
}) {
  return (
    <section className={`voice ${compact ? "compact" : ""}`}>
      <div>
        <p className="eyebrow">Voz</p>
        <strong>{compact ? "Velocidade" : "Velocidade da voz"}</strong>
        {compact ? null : <span>Escolha o quanto a frase é pausada ao ouvir.</span>}
      </div>
      <div className="rate-pills" role="group" aria-label="Velocidade da voz">
        {SPEAK_RATES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === selected ? "on" : "ghost"}
            title={item.hint}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
