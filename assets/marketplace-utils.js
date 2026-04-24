// Pure helpers for the marketplace UI. No DOM, no fetch — unit-testable.

export const CATEGORY_EMOJI = {
  telegram: "📨",
  "x-native": "🐦",
  discord: "🛡️",
  orchestration: "🔗",
  twitter: "🐦",
  example: "✨",
};

export const DEFAULT_EMOJI = "🤖";

export function emojiFor(category) {
  return CATEGORY_EMOJI[category] ?? DEFAULT_EMOJI;
}

export function installCount(n) {
  return Intl.NumberFormat("en-US").format(n);
}

export function matches(agent, q) {
  if (!q) return true;
  const needle = q.toLowerCase();
  const hay = [
    agent.name,
    agent.description,
    agent.category,
    ...(agent.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

export function uniqueCategories(agents) {
  return Array.from(
    new Set(agents.map((a) => a.category).filter(Boolean)),
  ).sort();
}
