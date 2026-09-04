import { units } from "./content.js";
import { bestMatch, scoreLabel, diffWords } from "./evaluate.js";
import { canListen, canSpeak, listenOnce, speakEnglish } from "./speech.js";
import { getState, saveScore, unitProgress } from "./storage.js";

const app = document.querySelector("#app");

const state = {
  view: "home",
  unitId: "hello",
  mode: "speak",
  index: 0,
  listening: false,
  lastResult: null,
  hintOpen: false,
  message: "",
  draft: "",
};

function unitById(id) {
  return units.find((unit) => unit.id === id) || units[0];
}

function currentList(unit = unitById(state.unitId)) {
  return state.mode === "speak" ? unit.speak : unit.write;
}

function goHome() {
  state.view = "home";
  state.lastResult = null;
  state.message = "";
  render();
}

function startUnit(unitId, mode = "speak", index = 0) {
  const unit = unitById(unitId);
  const list = mode === "speak" ? unit.speak : unit.write;
  state.view = "practice";
  state.unitId = unit.id;
  state.mode = mode;
  state.index = Math.min(index, list.length - 1);
  state.lastResult = null;
  state.hintOpen = false;
  state.message = "";
  state.draft = "";
  render();
}

function move(step) {
  const list = currentList();
  const next = state.index + step;
  if (next < 0 || next >= list.length) return;
  state.index = next;
  state.lastResult = null;
  state.hintOpen = false;
  state.message = "";
  state.draft = "";
  render();
}

async function playPhrase(text) {
  if (!canSpeak()) {
    state.message = "Este navegador não lê em voz alta.";
    render();
    return;
  }
  try {
    await speakEnglish(text);
  } catch (error) {
    state.message = error.message;
    render();
  }
}

async function recordSpeech(item) {
  if (state.listening) return;
  state.listening = true;
  state.message = "Pode falar...";
  state.lastResult = null;
  render();
  try {
    const heard = await listenOnce();
    const englishScore = bestMatch(heard, [item.en]).score;
    const label = scoreLabel(englishScore);
    saveScore(state.unitId, "speak", state.index, label.stars);
    state.lastResult = {
      kind: "speak",
      heard,
      expected: item.en,
      score: englishScore,
      label,
    };
    state.message = "";
  } catch (error) {
    state.message = error.message;
  } finally {
    state.listening = false;
    render();
  }
}

function checkWriting(item, input) {
  const match = bestMatch(input, item.answers);
  const label = scoreLabel(match.score);
  saveScore(state.unitId, "write", state.index, label.stars);
  state.lastResult = {
    kind: "write",
    heard: input,
    expected: item.answers[0],
    score: match.score,
    label,
    diff: diffWords(input, item.answers[0]),
    tip: item.tip,
  };
  state.message = "";
  render();
}

function stars(count) {
  return "●".repeat(count) + "○".repeat(Math.max(0, 3 - count));
}

function homeView() {
  const saved = getState();
  const totals = units.reduce(
    (acc, unit) => {
      const progress = unitProgress(unit, saved);
      acc.done += progress.done;
      acc.total += progress.total;
      acc.stars += progress.stars;
      return acc;
    },
    { done: 0, total: 0, stars: 0 }
  );

  return `
    <header class="top">
      <p class="eyebrow">Inglês básico para o trabalho</p>
      <h1>Fale e escreva, um pouco por dia.</h1>
      <p class="lead">Este é o começo, não o teto: um pacote básico de trabalho. Novas lições entram aqui. Ouça, repita e escreva — o app corrige na hora.</p>
      <div class="stats">
        <div><strong>${saved.xp}</strong><span>pontos</span></div>
        <div><strong>${totals.done}/${totals.total}</strong><span>frases</span></div>
        <div><strong>${totals.stars}</strong><span>estrelas</span></div>
      </div>
    </header>

    <section class="modes">
      <button class="mode-card speak" type="button" data-action="continue-speak">
        <span class="mode-kicker">Microfone</span>
        <strong>Treinar fala</strong>
        <span>Ouça o inglês e repita em voz alta.</span>
      </button>
      <button class="mode-card write" type="button" data-action="continue-write">
        <span class="mode-kicker">Teclado</span>
        <strong>Treinar escrita</strong>
        <span>Traduza frases do trabalho e veja a correção.</span>
      </button>
    </section>

    ${
      !canListen()
        ? `<p class="banner">Para a fala, use Chrome ou Edge e abra pelo botão Iniciar (endereço local). O microfone não funciona se você só abrir o arquivo HTML.</p>`
        : ""
    }

    <h2 class="section-title">Lições</h2>
    <div class="units">
      ${units
        .map((unit) => {
          const progress = unitProgress(unit, saved);
          const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
          return `
            <article class="unit">
              <div class="unit-top">
                <h3>${unit.title}</h3>
                <span>${progress.done}/${progress.total}</span>
              </div>
              <p>${unit.blurb}</p>
              <div class="bar"><i style="width:${pct}%"></i></div>
              <div class="unit-actions">
                <button type="button" data-start="${unit.id}:speak">Falar</button>
                <button type="button" class="ghost" data-start="${unit.id}:write">Escrever</button>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function practiceView() {
  const unit = unitById(state.unitId);
  const list = currentList(unit);
  const item = list[state.index];
  const result = state.lastResult;
  const isSpeak = state.mode === "speak";

  return `
    <div class="practice-top">
      <button class="back" type="button" data-action="home">← Lições</button>
      <div>
        <p class="eyebrow">${unit.title} · ${isSpeak ? "Fala" : "Escrita"}</p>
        <h2>${state.index + 1} de ${list.length}</h2>
      </div>
    </div>
    <div class="progress-dots" aria-hidden="true">
      ${list
        .map((_, i) => `<i class="${i === state.index ? "on" : ""} ${i < state.index ? "done" : ""}"></i>`)
        .join("")}
    </div>

    <article class="card">
      ${
        isSpeak
          ? `
            ${item.when ? `<p class="when">${item.when}</p>` : ""}
            <p class="phrase">${item.en}</p>
            <p class="meaning">${item.pt}</p>
            <div class="actions">
              <button type="button" class="ghost" data-action="listen" ${canSpeak() ? "" : "disabled"}>Ouvir</button>
              <button type="button" class="${state.listening ? "hot recording" : "hot"}" data-action="record" ${
                state.listening ? "disabled" : ""
              }>
                ${state.listening ? "Ouvindo..." : "Falar agora"}
              </button>
            </div>
          `
          : `
            <p class="when">${item.prompt}</p>
            <label class="sr" for="answer">Sua frase em inglês</label>
            <textarea id="answer" rows="3" placeholder="Escreva em inglês...">${escapeHtml(
              result?.heard || state.draft
            )}</textarea>
            <button class="hint-toggle" type="button" data-action="hint">${
              state.hintOpen ? "Esconder dica" : "Ver dica"
            }</button>
            ${state.hintOpen ? `<p class="hint">${item.hint}</p>` : ""}
            <div class="actions">
              <button type="button" class="hot" data-action="check">Verificar</button>
            </div>
          `
      }
    </article>

    ${state.message ? `<p class="banner">${state.message}</p>` : ""}

    ${
      result
        ? `
      <section class="result ${result.label.key}">
        <div class="result-head">
          <strong>${result.label.text}</strong>
          <span class="stars">${stars(result.label.stars)}</span>
        </div>
        ${
          result.kind === "speak"
            ? `<p>Eu ouvi: <em>${escapeHtml(result.heard || "—")}</em></p>
               <p>Modelo: <strong>${escapeHtml(result.expected)}</strong></p>`
            : `<p class="diff-line">Você: ${result.diff.yours
                .map((part) => `<span class="${part.ok ? "ok" : "bad"}">${escapeHtml(part.word)}</span>`)
                .join(" ")}</p>
               <p class="diff-line">Modelo: ${result.diff.expected
                 .map((part) => `<span class="${part.ok ? "ok" : "miss"}">${escapeHtml(part.word)}</span>`)
                 .join(" ")}</p>
               ${result.tip ? `<p class="hint">${result.tip}</p>` : ""}`
        }
      </section>
    `
        : ""
    }

    <div class="pager">
      <button type="button" class="ghost" data-action="prev" ${state.index === 0 ? "disabled" : ""}>Anterior</button>
      <button type="button" data-action="next" ${state.index === list.length - 1 ? "disabled" : ""}>Próxima</button>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  app.innerHTML = state.view === "home" ? homeView() : practiceView();
}

app.addEventListener("click", (event) => {
  const start = event.target.closest("[data-start]");
  if (start) {
    const [unitId, mode] = start.dataset.start.split(":");
    startUnit(unitId, mode, 0);
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  const saved = getState();
  if (action === "home") goHome();
  if (action === "continue-speak") startUnit(saved.lastUnit || "hello", "speak", 0);
  if (action === "continue-write") startUnit(saved.lastUnit || "hello", "write", 0);
  if (action === "prev") move(-1);
  if (action === "next") move(1);
  if (action === "hint") {
    const input = document.querySelector("#answer")?.value;
    if (typeof input === "string") state.draft = input;
    state.hintOpen = !state.hintOpen;
    state.message = "";
    render();
  }
  if (action === "listen") {
    const item = currentList()[state.index];
    playPhrase(item.en);
  }
  if (action === "record") {
    const item = currentList()[state.index];
    recordSpeech(item);
  }
  if (action === "check") {
    const item = currentList()[state.index];
    const input = document.querySelector("#answer")?.value || "";
    state.draft = input;
    if (!input.trim()) {
      state.message = "Escreva uma frase em inglês antes de verificar.";
      render();
      return;
    }
    checkWriting(item, input);
  }
});

app.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey && state.view === "practice" && state.mode === "write") {
    event.preventDefault();
    const item = currentList()[state.index];
    const input = document.querySelector("#answer")?.value || "";
    if (input.trim()) checkWriting(item, input);
  }
});

render();
