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

export function similarity(a: string, b: string) {
  const left = normalize(a);
  const right = normalize(b);
  if (!left && !right) return 1;
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

export function bestMatch(input: string, answers: string[]) {
  let best = { answer: answers[0] || "", score: 0 };
  for (const answer of answers) {
    const score = similarity(input, answer);
    if (score > best.score) best = { answer, score };
  }
  return best;
}

export function scoreLabel(score: number) {
  if (score >= 0.92) return { key: "great", text: "Muito bem", stars: 3 };
  if (score >= 0.75) return { key: "good", text: "Quase lá", stars: 2 };
  if (score >= 0.5) return { key: "ok", text: "Dá para melhorar", stars: 1 };
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
