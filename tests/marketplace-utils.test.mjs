import { describe, expect, it } from "vitest";
import {
  DEFAULT_EMOJI,
  emojiFor,
  installCount,
  matches,
  uniqueCategories,
} from "../assets/marketplace-utils.js";

describe("emojiFor", () => {
  it("returns the mapped emoji for known categories", () => {
    expect(emojiFor("telegram")).toBe("📨");
    expect(emojiFor("discord")).toBe("🛡️");
  });
  it("falls back to the default for unknown categories", () => {
    expect(emojiFor("anything-else")).toBe(DEFAULT_EMOJI);
    expect(emojiFor(undefined)).toBe(DEFAULT_EMOJI);
  });
});

describe("installCount", () => {
  it("formats with thousands separators", () => {
    expect(installCount(1284)).toBe("1,284");
    expect(installCount(0)).toBe("0");
    expect(installCount(1_000_000)).toBe("1,000,000");
  });
});

describe("matches", () => {
  const agent = {
    name: "Hermes Telegram Dashboard",
    description: "Community management",
    category: "telegram",
    tags: ["dashboard", "community"],
  };

  it("returns true for empty or whitespace queries", () => {
    expect(matches(agent, "")).toBe(true);
  });
  it("matches against name, description, category, and tags", () => {
    expect(matches(agent, "hermes")).toBe(true);
    expect(matches(agent, "TELEGRAM")).toBe(true);
    expect(matches(agent, "community")).toBe(true);
    expect(matches(agent, "dashboard")).toBe(true);
  });
  it("returns false when nothing matches", () => {
    expect(matches(agent, "discord")).toBe(false);
  });
  it("tolerates missing tags", () => {
    expect(matches({ ...agent, tags: undefined }, "hermes")).toBe(true);
  });
});

describe("uniqueCategories", () => {
  it("dedupes, filters empty, and sorts", () => {
    const result = uniqueCategories([
      { category: "telegram" },
      { category: "discord" },
      { category: "telegram" },
      { category: "" },
      { category: undefined },
      { category: "x-native" },
    ]);
    expect(result).toEqual(["discord", "telegram", "x-native"]);
  });
});
