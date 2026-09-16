const CONTRACTIONS: Array<[RegExp, string]> = [
  [/won't/g, "will not"],
  [/can't/g, "can not"],
  [/n't/g, " not"],
  [/'re/g, " are"],
  [/'s/g, " is"],
  [/'m/g, " am"],
  [/'ll/g, " will"],
  [/'ve/g, " have"],
  [/lets /g, "let us "],
];

export function normalize(text: string) {
  let value = (text || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/&/g, " and ");

  for (const [pattern, replacement] of CONTRACTIONS) {
    value = value.replace(pattern, replacement);
  }

  return value
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(text: string) {
  const value = normalize(text);
  return value ? value.split(" ") : [];
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = current;
    }
  }
  return row[b.length];
}

function charSimilarity(a: string, b: string) {
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
}

function sameWord(a: string, b: string) {
  if (a === b) return true;
  const shortest = Math.min(a.length, b.length);
  if (shortest <= 3) return false;
  return charSimilarity(a, b) >= 0.9;
}

function expectedWordsHeard(heard: string[], expected: string[]) {
  let i = 0;
  let matched = 0;
  for (const word of expected) {
    while (i < heard.length && !sameWord(heard[i], word)) i += 1;
    if (i >= heard.length) break;
    matched += 1;
    i += 1;
  }
  return matched;
}

function wordDistance(left: string[], right: string[]) {
  if (left.length === 0) return right.length;
  if (right.length === 0) return left.length;

  const row = Array.from({ length: right.length + 1 }, (_, i) => i);
  for (let i = 1; i <= left.length; i += 1) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const current = row[j];
      const cost = sameWord(left[i - 1], right[j - 1]) ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = current;
    }
  }
  return row[right.length];
}

export function similarity(a: string, b: string) {
  const left = tokens(a);
  const right = tokens(b);
  if (!left.length && !right.length) return 1;
  if (!left.length || !right.length) return 0;
  const alignment = 1 - wordDistance(left, right) / Math.max(left.length, right.length);
  const matched = expectedWordsHeard(left, right);
  if (matched < right.length) return Math.min(0.74, alignment, matched / right.length);
  return alignment;
}

export function bestMatch(input: string, answers: string[]) {
  let best = { answer: answers[0] || "", score: 0 };
  for (const answer of answers) {
    const score = similarity(input, answer);
    if (score > best.score) best = { answer, score };
  }
  return best;
}

export const AUTO_ADVANCE_STARS = 3;

export function scoreLabel(score: number) {
  if (score >= 0.94) return { key: "great", text: "Muito bem", stars: 3 };
  if (score >= 0.86) return { key: "good", text: "Quase lá", stars: 2 };
  if (score >= 0.55) return { key: "ok", text: "Dá para melhorar", stars: 1 };
  return { key: "try", text: "Tente de novo", stars: 0 };
}

export function diffWords(input: string, expected: string) {
  const left = tokens(input);
  const right = tokens(expected);
  const rightSet = new Set(right);
  const leftSet = new Set(left);

  return {
    yours: left.map((word) => ({ word, ok: rightSet.has(word) })),
    expected: right.map((word) => ({ word, ok: leftSet.has(word) })),
  };
}
