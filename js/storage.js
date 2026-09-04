const KEY = "ingles-no-trabalho-v1";

const empty = {
  xp: 0,
  lastUnit: "hello",
  lastMode: "speak",
  voiceRate: "very-slow",
  voiceRateVersion: 2,
  scores: {},
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty, scores: {} };
    const parsed = JSON.parse(raw);
    const state = { ...empty, ...parsed, scores: { ...empty.scores, ...(parsed.scores || {}) } };
    if (state.voiceRateVersion !== 2) {
      state.voiceRate = "very-slow";
      state.voiceRateVersion = 2;
      write(state);
    }
    return state;
  } catch {
    return { ...empty, scores: {} };
  }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  return state;
}

export function getState() {
  return read();
}

export function getVoiceRateId() {
  return read().voiceRate || "very-slow";
}

export function saveVoiceRate(id) {
  const state = read();
  state.voiceRate = id;
  return write(state);
}

export function itemKey(unitId, mode, index) {
  return `${unitId}:${mode}:${index}`;
}

export function saveScore(unitId, mode, index, stars) {
  const state = read();
  const key = itemKey(unitId, mode, index);
  const current = state.scores[key] || 0;
  if (stars > current) {
    state.xp += (stars - current) * 10;
    state.scores[key] = stars;
  }
  state.lastUnit = unitId;
  state.lastMode = mode;
  return write(state);
}

export function unitProgress(unit, state = read()) {
  const speakTotal = unit.speak.length;
  const writeTotal = unit.write.length;
  const total = speakTotal + writeTotal;
  let stars = 0;
  let done = 0;
  for (let i = 0; i < speakTotal; i += 1) {
    const value = state.scores[itemKey(unit.id, "speak", i)] || 0;
    stars += value;
    if (value) done += 1;
  }
  for (let i = 0; i < writeTotal; i += 1) {
    const value = state.scores[itemKey(unit.id, "write", i)] || 0;
    stars += value;
    if (value) done += 1;
  }
  return { done, total, stars, maxStars: total * 3 };
}
