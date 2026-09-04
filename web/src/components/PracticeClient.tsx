"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { bestMatch, diffWords, scoreLabel } from "@/lib/evaluate";
import { canSpeak, listenOnce, speakEnglish } from "@/lib/speech";
import type { Unit } from "@/lib/content";
import { VoiceControls } from "./VoiceControls";

type Result = {
  kind: "speak" | "write";
  heard: string;
  expected: string;
  label: { key: string; text: string; stars: number };
  diff?: ReturnType<typeof diffWords>;
  tip?: string;
};

export function PracticeClient({
  unit,
  mode,
  voiceRate,
}: {
  unit: Unit;
  mode: "speak" | "write";
  voiceRate: string;
}) {
  const list = mode === "speak" ? unit.speak : unit.write;
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [rate, setRate] = useState(voiceRate);
  const item = list[index];

  const stars = useMemo(
    () => (count: number) => "●".repeat(count) + "○".repeat(Math.max(0, 3 - count)),
    []
  );

  function move(step: number) {
    const next = index + step;
    if (next < 0 || next >= list.length) return;
    setIndex(next);
    setResult(null);
    setHintOpen(false);
    setMessage("");
    setDraft("");
  }

  async function persist(starsCount: number) {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitId: unit.id, mode, index, stars: starsCount }),
    });
  }

  async function play(text: string, rateId = rate) {
    try {
      await speakEnglish(text, { rateId });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não consegui reproduzir.");
    }
  }

  async function changeVoice(id: string) {
    setRate(id);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voiceRate: id }),
    });
    if (mode === "speak" && "en" in item) await play(item.en, id);
  }

  async function record() {
    if (listening || !("en" in item)) return;
    setListening(true);
    setMessage("Pode falar...");
    setResult(null);
    try {
      const heard = await listenOnce();
      const target = item.en as string;
      const englishScore = bestMatch(heard, [target]).score;
      const label = scoreLabel(englishScore);
      await persist(label.stars);
      setResult({ kind: "speak", heard, expected: target, label });
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não consegui ouvir.");
    } finally {
      setListening(false);
    }
  }

  async function check() {
    if (!("answers" in item)) return;
    if (!draft.trim()) {
      setMessage("Escreva uma frase em inglês antes de verificar.");
      return;
    }
    const match = bestMatch(draft, item.answers);
    const label = scoreLabel(match.score);
    await persist(label.stars);
    setResult({
      kind: "write",
      heard: draft,
      expected: item.answers[0],
      label,
      diff: diffWords(draft, item.answers[0]),
      tip: item.tip,
    });
    setMessage("");
  }

  return (
    <>
      <div className="practice-top">
        <Link className="back" href="/">
          ← Meu dia
        </Link>
        <div>
          <p className="eyebrow">
            {unit.title} · {mode === "speak" ? "Fala" : "Escrita"}
          </p>
          <h2>
            {index + 1} de {list.length}
          </h2>
        </div>
      </div>
      <div className="progress-dots" aria-hidden="true">
        {list.map((_, i) => (
          <i key={i} className={`${i === index ? "on" : ""} ${i < index ? "done" : ""}`} />
        ))}
      </div>
      <article className="card">
        {mode === "speak" && "en" in item ? (
          <>
            {item.when ? <p className="when">{item.when}</p> : null}
            <p className="phrase">{item.en}</p>
            <p className="meaning">{item.pt}</p>
            <VoiceControls compact selected={rate} onChange={changeVoice} />
            <div className="actions">
              <button className="ghost" type="button" disabled={!canSpeak()} onClick={() => play(item.en)}>
                Ouvir
              </button>
              <button className={listening ? "hot recording" : "hot"} type="button" disabled={listening} onClick={record}>
                {listening ? "Ouvindo..." : "Falar agora"}
              </button>
            </div>
          </>
        ) : "prompt" in item ? (
          <>
            <p className="when">{item.prompt}</p>
            <label className="sr" htmlFor="answer">
              Sua frase em inglês
            </label>
            <textarea
              id="answer"
              rows={3}
              placeholder="Escreva em inglês..."
              value={result?.heard || draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setResult(null);
              }}
            />
            <button className="hint-toggle" type="button" onClick={() => setHintOpen((open) => !open)}>
              {hintOpen ? "Esconder dica" : "Ver dica"}
            </button>
            {hintOpen ? <p className="hint">{item.hint}</p> : null}
            <div className="actions">
              <button className="hot" type="button" onClick={check}>
                Verificar
              </button>
            </div>
          </>
        ) : null}
      </article>
      {message ? <p className="banner">{message}</p> : null}
      {result ? (
        <section className={`result ${result.label.key}`}>
          <div className="result-head">
            <strong>{result.label.text}</strong>
            <span className="stars">{stars(result.label.stars)}</span>
          </div>
          {result.kind === "speak" ? (
            <>
              <p>
                Eu ouvi: <em>{result.heard || "—"}</em>
              </p>
              <p>
                Modelo: <strong>{result.expected}</strong>
              </p>
            </>
          ) : (
            <>
              <p className="diff-line">
                Você:{" "}
                {result.diff?.yours.map((part, i) => (
                  <span key={i} className={part.ok ? "ok" : "bad"}>
                    {part.word}
                  </span>
                ))}
              </p>
              <p className="diff-line">
                Modelo:{" "}
                {result.diff?.expected.map((part, i) => (
                  <span key={i} className={part.ok ? "ok" : "miss"}>
                    {part.word}
                  </span>
                ))}
              </p>
              {result.tip ? <p className="hint">{result.tip}</p> : null}
            </>
          )}
        </section>
      ) : null}
      <div className="pager">
        <button className="ghost" type="button" disabled={index === 0} onClick={() => move(-1)}>
          Anterior
        </button>
        <button type="button" disabled={index === list.length - 1} onClick={() => move(1)}>
          Próxima
        </button>
      </div>
    </>
  );
}
