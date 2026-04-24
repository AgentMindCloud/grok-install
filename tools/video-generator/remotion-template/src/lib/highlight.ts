// Tiny syntax highlighter - no external deps. Covers Python, JS, and TS well
// enough for the short code snippets we render. Each input character lands in
// exactly one token so the typing animation can reveal it character-by-character
// without re-tokenizing per frame.

export type Token = {
  text: string;
  kind:
    | 'text'
    | 'keyword'
    | 'string'
    | 'number'
    | 'comment'
    | 'function'
    | 'type';
};

const KEYWORDS: Record<string, Set<string>> = {
  python: new Set([
    'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from',
    'as', 'class', 'async', 'await', 'with', 'try', 'except', 'raise', 'pass',
    'yield', 'in', 'not', 'and', 'or', 'is', 'True', 'False', 'None', 'lambda',
    'self',
  ]),
  javascript: new Set([
    'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
    'import', 'from', 'export', 'default', 'class', 'async', 'await', 'new',
    'this', 'try', 'catch', 'throw', 'true', 'false', 'null', 'undefined',
    'typeof',
  ]),
  typescript: new Set([
    'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
    'import', 'from', 'export', 'default', 'class', 'async', 'await', 'new',
    'this', 'try', 'catch', 'throw', 'true', 'false', 'null', 'undefined',
    'typeof', 'interface', 'type', 'enum', 'readonly', 'public', 'private',
    'protected', 'as',
  ]),
};

export const tokenize = (
  source: string,
  language: 'python' | 'javascript' | 'typescript',
): Token[] => {
  const keywords = KEYWORDS[language] ?? KEYWORDS.javascript;
  const commentMark = language === 'python' ? '#' : '//';
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i];

    if (ch === commentMark[0] && source.startsWith(commentMark, i)) {
      const end = source.indexOf('\n', i);
      const stop = end === -1 ? source.length : end;
      tokens.push({text: source.slice(i, stop), kind: 'comment'});
      i = stop;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      let j = i + 1;
      while (j < source.length && source[j] !== quote) {
        if (source[j] === '\\') j += 2;
        else j += 1;
      }
      j = Math.min(source.length, j + 1);
      tokens.push({text: source.slice(i, j), kind: 'string'});
      i = j;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let j = i + 1;
      while (j < source.length && /[0-9._]/.test(source[j])) j += 1;
      tokens.push({text: source.slice(i, j), kind: 'number'});
      i = j;
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let j = i + 1;
      while (j < source.length && /[A-Za-z0-9_$]/.test(source[j])) j += 1;
      const word = source.slice(i, j);
      let kind: Token['kind'] = 'text';
      if (keywords.has(word)) kind = 'keyword';
      else if (source[j] === '(') kind = 'function';
      else if (/^[A-Z]/.test(word)) kind = 'type';
      tokens.push({text: word, kind});
      i = j;
      continue;
    }

    tokens.push({text: ch, kind: 'text'});
    i += 1;
  }

  return tokens;
};

export const colorFor = (
  kind: Token['kind'],
  palette: {cyan: string; violet: string; amber: string; fg: string; muted: string},
): string => {
  switch (kind) {
    case 'keyword':
      return palette.violet;
    case 'string':
      return palette.amber;
    case 'number':
      return palette.amber;
    case 'comment':
      return palette.muted;
    case 'function':
      return palette.cyan;
    case 'type':
      return palette.cyan;
    default:
      return palette.fg;
  }
};
