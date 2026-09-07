"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { bestMatch, diffWords, scoreLabel } from "@/lib/evaluate";
import { canSpeak, listenOnce, speakEnglish } from "@/lib/speech";
import { dailyHome, firstIncompleteIndex, isUnitComplete, itemDone, itemKey, unitProgress, type Unit } from "@/lib/content";
import { VoiceControls } from "./VoiceControls";
import type { RoleId } from "@/lib/roles";

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
  scores: initialScores,
  roles,
  completedAt: initialCompletedAt,
}: {
  unit: Unit;
  mode: "speak" | "write";
  voiceRate: string;
  scores: Record<string, number>;
  roles: RoleId[];
  completedAt: Record<string, string>;
}) {
  const list = mode === "speak" ? unit.speak : unit.write;
  const otherMode = mode === "speak" ? "write" : "speak";
  const [index, setIndex] = useState(() => {
    const next = firstIncompleteIndex(unit, mode, initialScores || {});
    return next < 0 ? 0 : next;
  });
  const [listening, setListening] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [rate, setRate] = useState(voiceRate);
  const [speechOk, setSpeechOk] = useState(false);
  const [scores, setScores] = useState(initialScores || {});
  const [completedAt, setCompletedAt] = useState(initialCompletedAt || {});
  const [celebrate, setCelebrate] = useState(false);
  const [modeFinished, setModeFinished] = useState(() => firstIncompleteIndex(unit, mode, initialScores || {}) < 0);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const item = list[index];
  const scene = unitProgress(unit, scores);
  const otherHref = `/practice/${unit.id}/${otherMode}`;
  const dailyState = dailyHome(roles, scores, completedAt);

  useEffect(() => {
    setSpeechOk(canSpeak());
    return () => window.clearTimeout(advanceTimer.current);
  }, []);

  const stars = useMemo(
    () => (count: number) => "●".repeat(count) + "○".repeat(Math.max(0, 3 - count)),
    []
  );

  function resetCard(nextIndex: number) {
    setIndex(nextIndex);
    setResult(null);
    setHintOpen(false);
    setMessage("");
    setDraft("");
  }

  function move(step: number) {
    const next = index + step;
    if (next < 0 || next >= list.length) return;
    window.clearTimeout(advanceTimer.current);
    resetCard(next);
  }

  function afterSave(
    nextScores: Record<string, number>,
    nextCompletedAt: Record<string, string>,
    starsCount: number,
    alreadyComplete: boolean
  ) {
    setScores(nextScores);
    setCompletedAt(nextCompletedAt);
    const unitDone = isUnitComplete(unit, nextScores);
    if (!alreadyComplete && unitDone) {
      setCelebrate(true);
      setModeFinished(true);
      return;
    }
    if (starsCount < 1) return;
    const nextIncomplete = firstIncompleteIndex(unit, mode, nextScores);
    if (nextIncomplete < 0) {
      setModeFinished(true);
      return;
    }
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => resetCard(nextIncomplete), 1400);
  }

  async function persist(starsCount: number) {
    const alreadyComplete = isUnitComplete(unit, scores);
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitId: unit.id, mode, index, stars: starsCount }),
    });
    const next = (await response.json()) as {
      scores?: Record<string, number>;
      completedAt?: Record<string, string>;
    };
    const key = itemKey(unit.id, mode, index);
    const fallback = { ...scores, [key]: Math.max(scores[key] || 0, starsCount) };
    afterSave(next?.scores || fallback, next?.completedAt || completedAt, starsCount, alreadyComplete);
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
      setResult({ kind: "speak", heard, expected: target, label });
      setMessage(label.stars ? "Indo para a próxima frase..." : "Tente de novo nesta frase.");
      await persist(label.stars);
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
    setResult({
      kind: "write",
      heard: draft,
      expected: item.answers[0],
      label,
      diff: diffWords(draft, item.answers[0]),
      tip: item.tip,
    });
    setMessage(label.stars ? "Indo para a próxima frase..." : "Tente de novo nesta frase.");
    await persist(label.stars);
  }

  return (
    <>
      <div className="practice-top">
        <Link className="back" href="/">
          ← Meu dia
        </Link>
        <div>
          <p className="eyebrow">
            {unit.title} · {mode === "speak" ? "Fala" : "Escrita"} · cena {scene.done}/{scene.total}
          </p>
          <h2>
            {mode === "speak" ? "Fala" : "Escrita"} {index + 1} de {list.length}
          </h2>
        </div>
      </div>
      <div className="progress-dots" aria-hidden="true">
        {list.map((_, i) => (
          <i
            key={i}
            className={`${i === index ? "on" : ""} ${itemDone(unit.id, mode, i, scores) ? "done" : ""}`}
          />
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
              <button className="ghost" type="button" disabled={!speechOk} onClick={() => play(item.en)}>
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
      {modeFinished && !celebrate ? (
        <p className="banner">
          Você terminou a {mode === "speak" ? "fala" : "escrita"} desta cena.{" "}
          <Link href={otherHref}>Ir para {mode === "speak" ? "escrever" : "falar"}</Link> e completar as {scene.total}{" "}
          atividades.
        </p>
      ) : null}
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
          Próxima frase
        </button>
      </div>
      {celebrate ? (
        <div className="celebrate" role="dialog" aria-labelledby="celebrate-title">
          <p className="eyebrow">Cena concluída</p>
          <h2 id="celebrate-title">Parabéns!</h2>
          <p>
            Você completou as {scene.total} atividades de <strong>{unit.title}</strong>. Ela foi para{" "}
            <strong>Revisar</strong>.
            {unit.scene === "daily" && dailyState.status === "waiting" ? (
              <>
                {" "}
                A <strong>{dailyState.next.title}</strong> será liberada amanhã no Meu dia.
              </>
            ) : null}
          </p>
          <div className="actions">
            <Link href="/revisar">Ver em Revisar</Link>
            <Link className="ghost-link" href="/">
              Meu dia
            </Link>
            <button className="ghost" type="button" onClick={() => setCelebrate(false)}>
              Continuar aqui
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
