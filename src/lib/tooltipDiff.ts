/** Tokenize for Classic ↔ Forever tooltip diffs. */
export type DiffToken =
  | { type: "equal"; text: string }
  | { type: "remove"; text: string }
  | { type: "add"; text: string };

function tokenize(text: string): string[] {
  return text.match(/\S+|\s+/g) ?? [];
}

function wordTokens(text: string): string[] {
  return text.match(/\S+/g) ?? [];
}

/** Word-level LCS diff for short tooltip strings. */
export function diffWords(before: string, after: string): DiffToken[] {
  const a = tokenize(before);
  const b = tokenize(after);
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: m + 1 }, () => 0),
  );

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const tokens: DiffToken[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push(tokens, "equal", a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push(tokens, "remove", a[i]);
      i++;
    } else {
      push(tokens, "add", b[j]);
      j++;
    }
  }
  while (i < n) {
    push(tokens, "remove", a[i]);
    i++;
  }
  while (j < m) {
    push(tokens, "add", b[j]);
    j++;
  }
  return tokens;
}

/**
 * Prefer word diffs for light edits; when most of the text changed, show
 * Classic and Forever as whole blocks instead of a noisy word salad.
 */
export function tooltipDiff(before: string, after: string): DiffToken[] {
  const beforeWords = wordTokens(before);
  const afterWords = wordTokens(after);
  if (beforeWords.length === 0 || afterWords.length === 0) {
    return blockDiff(before, after);
  }

  const wordDiff = diffWords(before, after);
  const changed = wordDiff.reduce(
    (n, token) =>
      token.type === "equal" ? n : n + wordTokens(token.text).length,
    0,
  );
  const total = beforeWords.length + afterWords.length;
  const changeRatio = changed / total;

  // Heavy rewrite: whole Classic sentence/block vs whole Forever.
  if (changeRatio > 0.35 || changed > 12) {
    return blockDiff(before, after);
  }

  return wordDiff;
}

function blockDiff(before: string, after: string): DiffToken[] {
  return [
    { type: "remove", text: before },
    { type: "equal", text: "\n" },
    { type: "add", text: after },
  ];
}

function push(tokens: DiffToken[], type: DiffToken["type"], text: string) {
  const last = tokens[tokens.length - 1];
  if (last && last.type === type) {
    last.text += text;
    return;
  }
  tokens.push({ type, text });
}
