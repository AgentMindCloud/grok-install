// Marketplace UI for index.html. Loads featured-agents.json and trending.json,
// renders cards, wires the search box, and builds the category chip list from
// whatever categories appear in the fixtures — no framework, just fetch + DOM.

import {
  emojiFor,
  installCount,
  matches,
  uniqueCategories,
} from "./marketplace-utils.js";

const featuredRoot = document.querySelector('[data-role="featured"]');
const featuredError = document.querySelector('[data-role="featured-error"]');
const trendingRoot = document.querySelector('[data-role="trending"]');
const categoriesRoot = document.querySelector('[data-role="categories"]');
const searchInput = document.getElementById("marketplace-search");
const searchCount = document.querySelector('[data-role="search-count"]');

let allFeatured = [];

function renderFeatured(list) {
  if (!featuredRoot) return;
  featuredRoot.setAttribute("aria-busy", "false");
  featuredRoot.innerHTML = "";
  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "col-span-3 text-zinc-500 text-center py-8";
    empty.textContent = "No agents match your search.";
    featuredRoot.appendChild(empty);
    return;
  }
  for (const agent of list) {
    const card = document.createElement("a");
    card.href = agent.repo;
    card.className = "glass rounded-3xl p-6 card-hover block";
    card.rel = "noopener";

    const emoji = document.createElement("div");
    emoji.className =
      "h-48 bg-zinc-800 rounded-2xl mb-4 flex items-center justify-center text-4xl";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = emojiFor(agent.category);

    const h4 = document.createElement("h4");
    h4.className = "font-semibold text-lg mb-2";
    h4.textContent = agent.name;

    const p = document.createElement("p");
    p.className = "text-zinc-400 text-sm mb-4";
    p.textContent = agent.description;

    const footer = document.createElement("div");
    footer.className = "flex items-center justify-between text-xs";
    const installs = document.createElement("span");
    installs.className = "text-emerald-400";
    installs.textContent = `${installCount(agent.installs)} installs`;
    const badge = document.createElement("span");
    badge.className = "px-3 py-1 bg-[#00f0ff]/10 text-[#00f0ff] rounded-3xl";
    badge.textContent = "Verified by Grok";
    footer.append(installs, badge);

    card.append(emoji, h4, p, footer);
    featuredRoot.appendChild(card);
  }
}

function renderTrending(list) {
  if (!trendingRoot) return;
  trendingRoot.innerHTML = "";
  for (const item of list) {
    const row = document.createElement("div");
    row.className = "glass p-4 rounded-2xl flex justify-between items-center";
    const name = document.createElement("span");
    name.textContent = item.name;
    const delta = document.createElement("span");
    delta.className = "text-emerald-400";
    delta.textContent = `+${installCount(item.installs_this_week)} installs`;
    row.append(name, delta);
    trendingRoot.appendChild(row);
  }
}

function renderCategories(categories) {
  if (!categoriesRoot) return;
  categoriesRoot.innerHTML = "";
  for (const cat of categories) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.dataset.category = cat;
    chip.className =
      "glass px-5 py-2 rounded-3xl text-sm hover:border-[#00f0ff] cursor-pointer";
    chip.textContent = cat;
    chip.addEventListener("click", () => {
      if (!searchInput) return;
      searchInput.value = chip.dataset.category;
      applyFilter();
      searchInput.focus();
    });
    categoriesRoot.appendChild(chip);
  }
}

function applyFilter() {
  if (!searchInput) return;
  const q = searchInput.value.trim();
  const filtered = allFeatured.filter((a) => matches(a, q));
  renderFeatured(filtered);
  if (searchCount) {
    searchCount.textContent = q
      ? `${filtered.length} of ${allFeatured.length} agents match "${q}"`
      : "";
  }
}

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

async function init() {
  try {
    const [featured, trending] = await Promise.all([
      loadJSON("featured-agents.json"),
      loadJSON("trending.json"),
    ]);
    allFeatured = featured.featured ?? [];
    renderFeatured(allFeatured);
    renderTrending(trending.trending_this_week ?? []);
    renderCategories(uniqueCategories(allFeatured));
  } catch (err) {
    if (featuredRoot) featuredRoot.setAttribute("aria-busy", "false");
    if (featuredError) {
      featuredError.textContent = `Could not load marketplace data: ${err.message}`;
      featuredError.classList.remove("hidden");
    }
    console.error(err);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }
}

init();
